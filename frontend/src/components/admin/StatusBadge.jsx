import React from 'react';

/**
 * StatusBadge Component
 * Displays formatted badge for Order status, Payment status, or Product availability.
 */
export default function StatusBadge({ status, type = 'order' }) {
  if (!status) return null;

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  if (type === 'order') {
    switch (status.toUpperCase()) {
      case 'PENDING':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
        label = 'Pending';
        break;
      case 'CONFIRMED':
        colorClasses = 'bg-blue-50 text-blue-800 border-blue-200/80';
        label = 'Confirmed';
        break;
      case 'PREPARING':
        colorClasses = 'bg-purple-50 text-purple-800 border-purple-200/80';
        label = 'Preparing';
        break;
      case 'OUT_FOR_DELIVERY':
        colorClasses = 'bg-sky-50 text-sky-800 border-sky-200/80';
        label = 'Out for Delivery';
        break;
      case 'DELIVERED':
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
        label = 'Delivered';
        break;
      case 'CANCELLED':
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
        label = 'Cancelled';
        break;
      default:
        label = status;
    }
  } else if (type === 'payment') {
    switch (status.toUpperCase()) {
      case 'PAID':
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
        label = 'Paid';
        break;
      case 'PENDING':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
        label = 'Unpaid';
        break;
      case 'FAILED':
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
        label = 'Failed';
        break;
      default:
        label = status;
    }
  } else if (type === 'availability') {
    if (status === true || status === 'true' || status === 'AVAILABLE') {
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      label = 'Available';
    } else {
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
      label = 'Unavailable';
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${colorClasses}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
