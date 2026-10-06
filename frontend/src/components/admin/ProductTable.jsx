import React from 'react';
import StatusBadge from './StatusBadge';
import { getProductImage, getFallbackImage } from '../../utils/imageUtils';

/**
 * ProductTable Component
 * Reusable table component displaying product details and actions.
 */
export default function ProductTable({
  products = [],
  onEdit,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
          <tr>
            <th className="px-5 py-3.5">Product</th>
            <th className="px-5 py-3.5">Category</th>
            <th className="px-5 py-3.5">Price</th>
            <th className="px-5 py-3.5">Stock</th>
            <th className="px-5 py-3.5">Availability</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50/80 transition">
              
              {/* Image & Product Name */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(product);
                    }}
                  />
                  <div>
                    <p className="font-extrabold text-slate-900 line-clamp-1">{product.name}</p>
                    <p className="line-clamp-1 text-xs text-slate-500 max-w-xs">
                      {product.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-5 py-4 text-xs font-bold text-slate-600">
                <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </td>

              {/* Price (BigDecimal formatted) */}
              <td className="px-5 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                ${Number(product.price || 0).toFixed(2)}
              </td>

              {/* Stock Quantity */}
              <td className="px-5 py-4 text-xs font-bold whitespace-nowrap">
                <span className={product.stockQuantity < 5 ? 'text-rose-600 font-black' : 'text-slate-700'}>
                  {product.stockQuantity ?? '0'} units
                </span>
              </td>

              {/* Availability Toggle */}
              <td className="px-5 py-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onToggleAvailability(product)}
                  className="inline-flex focus:outline-none transition transform active:scale-95"
                  title="Click to toggle product availability"
                >
                  <StatusBadge status={product.available} type="availability" />
                </button>
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
                  >
                    Delete
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
