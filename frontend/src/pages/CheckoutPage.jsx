import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { getAddresses, createAddress } from '../services/addressService';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import './CheckoutPage.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0);
}

/** Sri Lankan phone number validation helper */
function validateSriLankanPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.trim().replace(/\s+/g, '');
  // Accepts local 10-digit formats (0771234567, 0112345678) or international (+94771234567, 94771234567)
  const phoneRegex = /^(?:\+94|94|0)?(7[0-9]|11|2[1-7]|3[1-8]|4[1-7]|5[1-7]|6[1-7]|81|91)[0-9]{7}$/;
  return phoneRegex.test(cleaned);
}

export default function CheckoutPage() {
  const { cartItems = [], cartCount = 0, cartSubtotal = 0, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PAYHERE');

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('NEW');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Status & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdOrder, setCreatedOrder] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Fetch saved user addresses on load with strict Array check
  useEffect(() => {
    let isMounted = true;
    async function loadAddresses() {
      try {
        setLoadingAddresses(true);
        const list = await getAddresses();
        const safeList = Array.isArray(list) ? list : [];
        if (isMounted) {
          setAddresses(safeList);
          if (safeList.length > 0) {
            setSelectedAddressId(safeList[0].id);
          } else {
            setSelectedAddressId('NEW');
          }
        }
      } catch (err) {
        console.warn('[FoodHub Checkout] Could not load addresses:', err);
        if (isMounted) {
          setAddresses([]);
          setSelectedAddressId('NEW');
        }
      } finally {
        if (isMounted) {
          setLoadingAddresses(false);
        }
      }
    }
    loadAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync customer name if user context changes
  useEffect(() => {
    if (user?.name && !customerName) {
      setCustomerName(user.name);
    }
  }, [user, customerName]);

  // Form submit handler
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const itemsArray = Array.isArray(cartItems) ? cartItems : [];

    // 1. Check cart not empty
    if (itemsArray.length === 0) {
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const errors = {};

    // 2. Validate customer name
    if (!customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }

    // 3. Validate Sri Lankan phone number format
    if (!customerPhone.trim()) {
      errors.customerPhone = 'Phone number is required';
    } else if (!validateSriLankanPhone(customerPhone)) {
      errors.customerPhone = 'Invalid Sri Lankan phone number (e.g. 0771234567 or +94771234567)';
    }

    // 4. Validate delivery address
    if (selectedAddressId === 'NEW') {
      if (!newAddressLine.trim()) errors.addressLine = 'Address line is required';
      if (!newCity.trim()) errors.city = 'City is required';
      if (!newPostalCode.trim()) errors.postalCode = 'Postal code is required';
    } else if (!selectedAddressId) {
      errors.address = 'Please select a delivery address';
    }

    // 5. Check product availability & stock pre-validation
    const stockErrors = [];
    itemsArray.forEach((item) => {
      const pName = item.name || 'Dish';
      if (item.available === false) {
        stockErrors.push(`"${pName}" is currently unavailable.`);
      }
      if (item.stockQuantity !== undefined && item.quantity > item.stockQuantity) {
        stockErrors.push(`Requested quantity for "${pName}" (${item.quantity}) exceeds available stock (${item.stockQuantity}).`);
      }
    });

    if (stockErrors.length > 0) {
      setError(stockErrors.join(' '));
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the validation errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAddressId = selectedAddressId;

      // Create new address if user entered a new delivery address
      if (selectedAddressId === 'NEW') {
        const savedAddress = await createAddress({
          addressLine: newAddressLine.trim(),
          city: newCity.trim(),
          postalCode: newPostalCode.trim(),
        });
        finalAddressId = savedAddress.id;
      }

      // Construct order payload (trusted values ONLY: productId, quantity)
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        addressId: Number(finalAddressId),
        paymentMethod: paymentMethod,
        notes: notes.trim(),
        items: itemsArray.map((item) => ({
          productId: Number(item.productId || item.id),
          quantity: Number(item.quantity),
        })),
      };

      // Call backend POST /api/orders
      const responseOrder = await createOrder(orderPayload);

      // On success: clear cart and display confirmation
      if (clearCart) clearCart();
      setCreatedOrder(responseOrder);
    } catch (err) {
      console.error('[FoodHub Checkout] Order submission failed:', err);
      let errMsg = 'Failed to submit order. Please check your network and try again.';

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (data) {
          if (data.fields && Object.keys(data.fields).length > 0) {
            errMsg = Object.values(data.fields).join('. ');
          } else if (data.message) {
            errMsg = data.message;
          } else if (data.error) {
            errMsg = data.error;
          }
        }
        if (status === 401) {
          errMsg = 'Session expired. Please log in again to place your order.';
        } else if (status === 403) {
          errMsg = 'You do not have permission to perform this order action.';
        }
      }

      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  // ═══════════════════════════════════════════════════════════
  // 1. ORDER CONFIRMATION SCREEN (When order is placed successfully)
  // ═══════════════════════════════════════════════════════════
  if (createdOrder) {
    const isPayHere = createdOrder.paymentMethod === 'PAYHERE';
    const isWhatsApp = createdOrder.paymentMethod === 'WHATSAPP';

    const itemsListStr = Array.isArray(createdOrder.items)
      ? createdOrder.items
          .map((item) => `• ${item.productName || item.product?.name || 'Dish'} x${item.quantity} (LKR ${item.unitPrice})`)
          .join('\n')
      : '';

    const addressStr = createdOrder.address
      ? `${createdOrder.address.addressLine}, ${createdOrder.address.city} (${createdOrder.address.postalCode})`
      : 'Delivery Address';

    const whatsappMessage = encodeURIComponent(
      `*New FoodHub Order #${createdOrder.id}*\n\n` +
      `*Customer:* ${createdOrder.customerName}\n` +
      `*Phone:* ${createdOrder.customerPhone}\n\n` +
      `*Order Items:*\n${itemsListStr}\n\n` +
      `*Total Amount:* LKR ${createdOrder.totalAmount}\n` +
      `*Delivery Address:* ${addressStr}\n` +
      `*Payment Method:* WhatsApp Order\n` +
      `*Order Status:* ${createdOrder.orderStatus}\n` +
      `*Payment Status:* ${createdOrder.paymentStatus}\n\n` +
      `Thank you! Please confirm my order details.`
    );

    const whatsappUrl = `https://wa.me/94771234567?text=${whatsappMessage}`;

    return (
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="fh-confirmation-card">
          <div className="fh-confirmation-icon" aria-hidden="true">
            ✓
          </div>
          <h1 className="fh-confirmation-title">Order Placed Successfully!</h1>
          <p className="fh-confirmation-subtitle">
            Thank you for dining with FoodHub! Your order has been registered securely.
          </p>

          <div className="fh-order-badge-row">
            <span className="fh-order-badge fh-order-badge--id">
              Order ID: #{createdOrder.id}
            </span>
            <span className="fh-order-badge fh-order-badge--pending">
              Status: {createdOrder.orderStatus}
            </span>
            <span className="fh-order-badge fh-order-badge--pending">
              Payment: {createdOrder.paymentStatus}
            </span>
          </div>

          {/* Order Breakdown */}
          <div className="my-6 rounded-xl bg-slate-50 p-6 text-left border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-3 border-b pb-2">
              Order Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700 mb-4">
              <div>
                <span className="block font-semibold text-slate-900">Customer Name:</span>
                {createdOrder.customerName}
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Phone Number:</span>
                {createdOrder.customerPhone}
              </div>
              <div className="md:col-span-2">
                <span className="block font-semibold text-slate-900">Delivery Address:</span>
                {addressStr}
              </div>
            </div>

            <div className="border-t pt-3">
              <span className="block font-semibold text-slate-900 mb-2">Items Summary:</span>
              <ul className="space-y-1.5 text-sm">
                {Array.isArray(createdOrder.items) &&
                  createdOrder.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {it.productName || it.product?.name || 'Dish'} x {it.quantity}
                      </span>
                      <span className="font-semibold">{formatCurrency(it.subtotal)}</span>
                    </li>
                  ))}
              </ul>
              <div className="mt-3 border-t pt-2 flex justify-between font-bold text-slate-900 text-base">
                <span>Final Order Amount:</span>
                <span className="text-orange-600">{formatCurrency(createdOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action based on selected payment method */}
          {isPayHere && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6 text-left">
              <h3 className="text-base font-bold text-blue-900 mb-2 flex items-center gap-2">
                💳 PayHere Sandbox Payment
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Your order is created! Click below to launch the PayHere Sandbox test payment portal.
              </p>

              <form action="https://sandbox.payhere.lk/pay/checkout" method="post" target="_blank">
                <input type="hidden" name="merchant_id" value={import.meta.env.VITE_PAYHERE_MERCHANT_ID || '1210000'} />
                <input type="hidden" name="return_url" value={`${window.location.origin}/cart`} />
                <input type="hidden" name="cancel_url" value={`${window.location.origin}/checkout`} />
                <input type="hidden" name="notify_url" value="http://localhost:8080/api/payments/notify" />
                <input type="hidden" name="order_id" value={createdOrder.id} />
                <input type="hidden" name="items" value={`FoodHub Order #${createdOrder.id}`} />
                <input type="hidden" name="currency" value="LKR" />
                <input type="hidden" name="amount" value={createdOrder.totalAmount} />
                <input type="hidden" name="first_name" value={createdOrder.customerName} />
                <input type="hidden" name="last_name" value="" />
                <input type="hidden" name="email" value={user?.email || 'customer@foodhub.com'} />
                <input type="hidden" name="phone" value={createdOrder.customerPhone} />
                <input type="hidden" name="address" value={createdOrder.address?.addressLine || ''} />
                <input type="hidden" name="city" value={createdOrder.address?.city || 'Colombo'} />
                <input type="hidden" name="country" value="Sri Lanka" />

                <button type="submit" className="fh-btn-payhere">
                  Proceed to PayHere Sandbox Checkout ↗
                </button>
              </form>
            </div>
          )}

          {isWhatsApp && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-left">
              <h3 className="text-base font-bold text-emerald-900 mb-2 flex items-center gap-2">
                📱 Complete Order via WhatsApp
              </h3>
              <p className="text-sm text-emerald-800 mb-4">
                Click below to open WhatsApp with your exact order summary pre-filled. Send it to our staff to confirm dispatch!
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fh-btn-whatsapp"
              >
                Send Order via WhatsApp ↗
              </a>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 text-center"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 2. EMPTY CART GUARD
  // ═══════════════════════════════════════════════════════════
  if (safeCartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
            🛒
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You cannot proceed to checkout with an empty cart. Please select items from our culinary menu first.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Explore Menu &amp; Order
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // 3. MAIN CHECKOUT FORM SCREEN
  // ═══════════════════════════════════════════════════════════
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fh-checkout-page">
      {/* Header */}
      <div className="fh-checkout-header">
        <div className="fh-checkout-breadcrumb">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-orange-600 transition-colors">Cart</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Checkout</span>
        </div>
        <h1 className="fh-checkout-title">Checkout &amp; Order Placement</h1>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmitOrder}>
        <div className="fh-checkout-grid">
          {/* Left Column: Customer & Delivery Details */}
          <div>
            {/* Step 1: Customer Information */}
            <div className="fh-checkout-card">
              <h2 className="fh-checkout-card__title">
                <span>1.</span> Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                      fieldErrors.customerName
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {fieldErrors.customerName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Phone Number (Sri Lanka) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                      fieldErrors.customerPhone
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                    placeholder="0771234567 or +94771234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  {fieldErrors.customerPhone && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address Selection */}
            <div className="fh-checkout-card">
              <h2 className="fh-checkout-card__title">
                <span>2.</span> Delivery Information
              </h2>

              {loadingAddresses ? (
                <div className="py-4 text-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {safeAddresses.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Select a Saved Delivery Address
                      </label>
                      <div className="fh-address-grid">
                        {safeAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`fh-address-card ${
                              selectedAddressId === addr.id ? 'fh-address-card--selected' : ''
                            }`}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <input
                              type="radio"
                              name="deliveryAddress"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="fh-address-card__radio"
                            />
                            <div className="fh-address-card__line">{addr.addressLine}</div>
                            <div className="fh-address-card__sub">
                              {addr.city}, {addr.postalCode}
                            </div>
                          </div>
                        ))}

                        {/* Add New Option Card */}
                        <div
                          className={`fh-address-card ${
                            selectedAddressId === 'NEW' ? 'fh-address-card--selected' : ''
                          }`}
                          onClick={() => setSelectedAddressId('NEW')}
                        >
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={selectedAddressId === 'NEW'}
                            onChange={() => setSelectedAddressId('NEW')}
                            className="fh-address-card__radio"
                          />
                          <div className="fh-address-card__line">+ Add New Address</div>
                          <div className="fh-address-card__sub">Enter custom delivery address</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New Address Fields */}
                  {(selectedAddressId === 'NEW' || safeAddresses.length === 0) && (
                    <div className="space-y-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        New Delivery Address Details
                      </h4>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700">
                          Street / Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={selectedAddressId === 'NEW'}
                          className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                            fieldErrors.addressLine
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                          }`}
                          placeholder="No 123, Galle Road, Bambalapitiya"
                          value={newAddressLine}
                          onChange={(e) => setNewAddressLine(e.target.value)}
                        />
                        {fieldErrors.addressLine && (
                          <p className="mt-1 text-xs text-red-600">{fieldErrors.addressLine}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required={selectedAddressId === 'NEW'}
                            className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                              fieldErrors.city
                                ? 'border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                            }`}
                            placeholder="Colombo"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                          />
                          {fieldErrors.city && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700">
                            Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required={selectedAddressId === 'NEW'}
                            className={`mt-1 block w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                              fieldErrors.postalCode
                                ? 'border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                            }`}
                            placeholder="00400"
                            value={newPostalCode}
                            onChange={(e) => setNewPostalCode(e.target.value)}
                          />
                          {fieldErrors.postalCode && (
                            <p className="mt-1 text-xs text-red-600">{fieldErrors.postalCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional Delivery Notes */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Order Notes / Special Instructions (Optional)
                    </label>
                    <textarea
                      rows="2"
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="e.g. Ring the bell twice, leave with security..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="fh-checkout-card">
              <h2 className="fh-checkout-card__title">
                <span>3.</span> Payment Method
              </h2>

              <div className="fh-payment-options">
                {/* PayHere Sandbox */}
                <div
                  className={`fh-payment-card ${
                    paymentMethod === 'PAYHERE' ? 'fh-payment-card--selected' : ''
                  }`}
                  onClick={() => setPaymentMethod('PAYHERE')}
                >
                  <div className="fh-payment-card__header">
                    <span className="fh-payment-card__icon" aria-hidden="true">💳</span>
                    <span className="fh-payment-card__badge fh-payment-card__badge--sandbox">
                      Sandbox Test
                    </span>
                  </div>
                  <div className="fh-payment-card__title">PayHere Gateway</div>
                  <div className="fh-payment-card__desc">
                    Pay securely using credit/debit cards or Genie via PayHere Sandbox.
                  </div>
                </div>

                {/* WhatsApp Order */}
                <div
                  className={`fh-payment-card ${
                    paymentMethod === 'WHATSAPP' ? 'fh-payment-card--selected' : ''
                  }`}
                  onClick={() => setPaymentMethod('WHATSAPP')}
                >
                  <div className="fh-payment-card__header">
                    <span className="fh-payment-card__icon" aria-hidden="true">💬</span>
                    <span className="fh-payment-card__badge fh-payment-card__badge--whatsapp">
                      Instant WhatsApp
                    </span>
                  </div>
                  <div className="fh-payment-card__title">WhatsApp Ordering</div>
                  <div className="fh-payment-card__desc">
                    Place order and dispatch directly via WhatsApp message with our kitchen.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items & Summary Sidebar */}
          <div>
            <div className="fh-checkout-card sticky top-24">
              <h2 className="fh-checkout-card__title">Order Summary ({cartCount})</h2>

              {/* Items List */}
              <div className="fh-summary-items">
                {safeCartItems.map((item) => {
                  const pId = item.productId || item.id;
                  const hasImgErr = imgErrors[pId];

                  return (
                    <div key={pId} className="fh-summary-item">
                      {(item.image || item.imageUrl) && !hasImgErr ? (
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.name}
                          className="fh-summary-item__img"
                          onError={() => handleImageError(pId)}
                        />
                      ) : (
                        <div className="fh-summary-item__placeholder" aria-hidden="true">
                          🍽️
                        </div>
                      )}

                      <div className="fh-summary-item__details">
                        <div className="fh-summary-item__name">{item.name}</div>
                        <div className="fh-summary-item__meta">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </div>
                      </div>

                      <div className="fh-summary-item__price">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calculations */}
              <div className="fh-summary-rows">
                <div className="fh-summary-row">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cartSubtotal)}</span>
                </div>

                <div className="fh-summary-row">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>

                <div className="fh-summary-row fh-summary-row--total">
                  <span>Total Amount</span>
                  <span className="fh-summary-total-val">{formatCurrency(cartSubtotal)}</span>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
                <span className="font-semibold">Security Note:</span> Prices shown are uneditable. Backend calculates and verifies final amounts upon order placement.
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="fh-btn-place-order"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner /> Processing Order...
                  </>
                ) : (
                  <>
                    Place Order ({formatCurrency(cartSubtotal)}) →
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
