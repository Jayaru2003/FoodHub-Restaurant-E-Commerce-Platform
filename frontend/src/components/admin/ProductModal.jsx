import React from 'react';
import ProductForm from './ProductForm';

/**
 * ProductModal Component
 * Modal dialog wrapping ProductForm for creating or editing products.
 */
export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product = null,
  categories = [],
  submitting = false,
  error = null,
}) {
  if (!isOpen) return null;

  const isEditing = Boolean(product && product.id);

  const handleSubmit = async (payload) => {
    await onSave(payload, product?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isEditing ? 'Update existing product details and pricing' : 'Add a new dish to the FoodHub catalog'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Product Form */}
        <ProductForm
          initialData={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  );
}
