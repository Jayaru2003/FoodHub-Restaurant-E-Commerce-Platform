import React, { useState, useEffect } from 'react';
import ErrorMessage from '../ErrorMessage';

/**
 * ProductModal Component
 * Modal for creating and editing products in the Admin Dashboard.
 */
export default function ProductModal({ isOpen, onClose, onSave, product = null, categories = [] }) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stockQuantity: '10',
    available: true,
    categoryId: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        imageUrl: product.imageUrl || '',
        stockQuantity: product.stockQuantity !== undefined ? String(product.stockQuantity) : '10',
        available: product.available !== undefined ? Boolean(product.available) : true,
        categoryId: product.category?.id ? String(product.category.id) : (categories[0]?.id ? String(categories[0].id) : ''),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stockQuantity: '10',
        available: true,
        categoryId: categories[0]?.id ? String(categories[0].id) : '',
      });
    }
    setError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setError('Please provide a valid non-negative price.');
      return;
    }

    if (!formData.stockQuantity || isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) {
      setError('Please provide a valid stock quantity.');
      return;
    }

    if (!formData.categoryId) {
      setError('Please select a category.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl.trim() || '/images/product_burger_deluxe.jpg',
      stockQuantity: parseInt(formData.stockQuantity, 10),
      available: Boolean(formData.available),
      categoryId: parseInt(formData.categoryId, 10),
    };

    try {
      setSubmitting(true);
      await onSave(payload, product?.id);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Crispy Chicken Deluxe"
              required
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="14.99"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="50"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="" disabled>Select category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="/images/product_burger_deluxe.jpg"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of ingredients and dish specifics..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="available" className="text-sm font-semibold text-slate-700 select-none">
              Available for Ordering
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-orange-600 px-5 py-2 text-sm font-bold text-white hover:bg-orange-700 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
