import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

const ORDER_STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
];

const PAYMENT_STATUS_OPTIONS = [
  'PENDING',
  'PAID',
  'FAILED'
];

/**
 * OrderDetailsModal Component
 * Full detailed view of an order with inline status update controls.
 */
export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus, onUpdatePaymentStatus }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  if (!isOpen || !order) return null;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === order.orderStatus) return;
    try {
      setUpdatingStatus(true);
      await onUpdateStatus(order.id, newStatus);
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentChange = async (e) => {
    const newPaymentStatus = e.target.value;
    if (newPaymentStatus === order.paymentStatus) return;
    try {
      setUpdatingPayment(true);
      await onUpdatePaymentStatus(order.id, newPaymentStatus);
    } catch (err) {
      alert('Failed to update payment status');
    } finally {
      setUpdatingPayment(false);
    }
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Order #{order.id}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              Order Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Status controls bar */}
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Order Status
            </label>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.orderStatus} type="order" />
              <select
                value={order.orderStatus}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
              >
                {ORDER_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Payment Status
            </label>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.paymentStatus} type="payment" />
              <select
                value={order.paymentStatus}
                onChange={handlePaymentChange}
                disabled={updatingPayment}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
              >
                {PAYMENT_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-b border-slate-100 pb-5 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Info
            </h4>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {order.customerName || 'Guest / Unnamed'}
            </p>
            <p className="text-xs font-medium text-slate-600">
              📞 {order.customerPhone || 'N/A'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Placed on: {formattedDate}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivery Address
            </h4>
            {order.address ? (
              <div className="mt-1 text-xs font-medium text-slate-700">
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state || ''} {order.address.zipCode || ''}</p>
              </div>
            ) : (
              <p className="mt-1 text-xs text-slate-500 italic">No address recorded</p>
            )}

            {order.notes && (
              <div className="mt-2 rounded-lg bg-orange-50/60 p-2 text-xs text-orange-900">
                <span className="font-bold">Notes:</span> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Ordered Items
          </h4>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {item.productName || `Product #${item.productId}`}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        ${Number(item.price || 0).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No item breakdown available.
              </div>
            )}
          </div>
        </div>

        {/* Order Totals */}
        <div className="mt-4 flex flex-col items-end border-t border-slate-100 pt-4">
          <div className="w-full max-w-xs space-y-1.5 text-xs font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>${Number(order.deliveryFee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm font-extrabold text-slate-900">
              <span>Total Amount:</span>
              <span className="text-orange-600">${Number(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
