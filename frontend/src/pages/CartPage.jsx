import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';
import { getProductImage, getFallbackImage } from '../utils/imageUtils';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0);
}

/* Trash Icon SVG */
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/* Arrow Right SVG */
const IconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
  } = useCart();

  const [imgOverrides, setImgOverrides] = useState({});

  const handleImageError = (id, item) => {
    setImgOverrides((prev) => ({ ...prev, [id]: getFallbackImage(item) }));
  };

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="fh-cart-empty">
          <div className="fh-cart-empty__icon-wrap text-orange-600" aria-hidden="true">
            <IconCart />
          </div>
          <h1 className="fh-cart-empty__title">Your Cart is Empty</h1>
          <p className="fh-cart-empty__desc">
            Looks like you haven&apos;t added any delicious items to your cart yet. Explore our fresh menu to satisfy your cravings!
          </p>
          <Link to="/products" className="fh-btn-checkout" style={{ display: 'inline-flex', padding: '0.875rem 2rem' }}>
            Explore Menu &amp; Order
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fh-cart-page">
      {/* Header */}
      <div className="fh-cart-header">
        <div className="fh-cart-header__breadcrumb">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Shopping Cart</span>
        </div>
        <h1 className="fh-cart-header__title">
          Shopping Cart
          <span className="fh-cart-header__count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        </h1>
      </div>

      <div className="fh-cart-layout">
        {/* Left: Cart Items List */}
        <div className="fh-cart-list-card">
          <div className="fh-cart-list__header">
            <span className="fh-cart-list__header-title">Order Items ({cartItems.length})</span>
            <button
              type="button"
              onClick={clearCart}
              className="fh-cart-clear-btn"
              aria-label="Clear all items from cart"
            >
              <IconTrash /> Clear Cart
            </button>
          </div>

          <div className="fh-cart-items-wrap">
            {cartItems.map((item) => {
              const pId = item.productId || item.id;
              const maxStock = item.stockQuantity || 99;

              return (
                <article key={pId} className="fh-cart-item">
                  {/* Image */}
                  <div className="fh-cart-item__img-wrap">
                    <img
                      src={imgOverrides[pId] || getProductImage(item)}
                      alt={item.name}
                      className="fh-cart-item__img"
                      onError={() => handleImageError(pId, item)}
                    />
                  </div>

                  {/* Info */}
                  <div className="fh-cart-item__info">
                    <Link to={`/products/${pId}`} className="fh-cart-item__name">
                      {item.name}
                    </Link>
                    {item.category && (
                      <span className="fh-cart-item__meta">{item.category}</span>
                    )}
                    <span className="fh-cart-item__unit-price">
                      Unit Price: {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="fh-cart-qty">
                    <button
                      type="button"
                      className="fh-cart-qty__btn"
                      onClick={() => decreaseQuantity(pId)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="fh-cart-qty__input"
                      value={item.quantity}
                      onChange={(e) => setQuantity(pId, e.target.value)}
                      min="1"
                      max={maxStock}
                      aria-label={`Quantity for ${item.name}`}
                    />
                    <button
                      type="button"
                      className="fh-cart-qty__btn"
                      onClick={() => increaseQuantity(pId)}
                      disabled={item.quantity >= maxStock}
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="fh-cart-item__right">
                    <div className="fh-cart-item__subtotal">
                      {formatCurrency(item.subtotal)}
                    </div>
                    <button
                      type="button"
                      className="fh-cart-remove-btn"
                      onClick={() => removeFromCart(pId)}
                      title="Remove item"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <aside className="fh-cart-summary">
          <h2 className="fh-cart-summary__title">Order Summary</h2>

          <div className="fh-cart-summary__rows">
            <div className="fh-cart-summary__row">
              <span>Items Total ({cartCount})</span>
              <span className="font-semibold">{formatCurrency(cartSubtotal)}</span>
            </div>

            <div className="fh-cart-summary__row">
              <span>Estimated Delivery</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>

            <div className="fh-cart-summary__row fh-cart-summary__row--bold">
              <span>Cart Subtotal</span>
              <span className="fh-cart-summary__val">{formatCurrency(cartSubtotal)}</span>
            </div>
          </div>

          <div className="fh-cart-summary__note">
            <span aria-hidden="true">ℹ️</span>
            <span>
              Prices &amp; totals shown are estimated. Final taxes and charges will be recalculated securely during checkout.
            </span>
          </div>

          <div className="fh-cart-actions">
            <Link to="/checkout" className="fh-btn-checkout">
              Proceed to Checkout <IconArrowRight />
            </Link>

            <Link to="/products" className="fh-btn-continue">
              ← Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
