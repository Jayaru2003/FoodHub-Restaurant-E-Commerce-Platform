import React, { useState, useEffect } from 'react';
import ErrorMessage from '../ErrorMessage';

/**
 * ProductForm Component
 * Reusable form component for creating and editing products.
 * Handles validation, BigDecimal-compatible price parsing, and error feedback.
 */
export default function ProductForm({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  submitting = false,
  error: externalError = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stockQuantity: '10',
    available: true,
    categoryId: '',
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
        imageUrl: initialData.imageUrl || '',
        stockQuantity: initialData.stockQuantity !== undefined && initialData.stockQuantity !== null ? String(initialData.stockQuantity) : '0',
        available: initialData.available !== undefined ? Boolean(initialData.available) : true,
        categoryId: initialData.category?.id
          ? String(initialData.category.id)
          : (categories.length > 0 ? String(categories[0].id) : ''),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        stockQuantity: '10',
        available: true,
        categoryId: categories.length > 0 ? String(categories[0].id) : '',
      });
    }
    setValidationError('');
  }, [initialData, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (validationError) setValidationError('');
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // 1. Name validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setValidationError('Product name is required.');
      return;
    }
    if (trimmedName.length > 150) {
      setValidationError('Product name must not exceed 150 characters.');
      return;
    }

    // 2. Price validation (BigDecimal compatible)
    const rawPrice = formData.price.trim();
    if (!rawPrice) {
      setValidationError('Price is required.');
      return;
    }
    const priceNum = parseFloat(rawPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setValidationError('Price must be a valid non-negative number.');
      return;
    }
    // Check decimal format (up to 2 decimal places)
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(rawPrice)) {
      setValidationError('Price must be a valid amount with up to 2 decimal places (e.g. 14.99).');
      return;
    }

    // 3. Stock quantity validation
    const rawStock = formData.stockQuantity.trim();
    if (!rawStock) {
      setValidationError('Stock quantity is required.');
      return;
    }
    const stockNum = Number(rawStock);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      setValidationError('Stock quantity must be a non-negative whole integer.');
      return;
    }

    // 4. Category validation
    if (!formData.categoryId) {
      setValidationError('Please select a valid category.');
      return;
    }
    const selectedCatId = parseInt(formData.categoryId, 10);
    const isValidCategory = categories.some((cat) => cat.id === selectedCatId);
    if (!isValidCategory) {
      setValidationError('Selected category is invalid or no longer exists.');
      return;
    }

    // Prepare payload
    const payload = {
      name: trimmedName,
      description: formData.description ? formData.description.trim() : '',
      price: priceNum,
      imageUrl: formData.imageUrl ? formData.imageUrl.trim() : '',
      stockQuantity: stockNum,
      available: Boolean(formData.available),
      categoryId: selectedCatId,
    };

    onSubmit(payload);
  };

  const displayError = validationError || externalError;

  return (
    <form onSubmit={validateAndSubmit} className="space-y-4">
      {displayError && (
        <div className="rounded-xl bg-rose-50 p-3.5 border border-rose-200">
          <ErrorMessage message={displayError} />
        </div>
      )}

      {/* Product Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Deluxe Cheeseburger"
          disabled={submitting}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-100"
        />
      </div>

      {/* Price & Stock Quantity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Price ($) *
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="12.99"
            disabled={submitting}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-100"
          />
          <p className="mt-1 text-[11px] text-slate-400">Decimal format: 0.00 to 9999.99</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="50"
            disabled={submitting}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-100"
          />
          <p className="mt-1 text-[11px] text-slate-400">Must be 0 or greater</p>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          Category *
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          disabled={submitting}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-100"
        >
          <option value="" disabled>Select category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          Image URL
        </label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="/images/product_pizza_margherita.jpg or https://..."
          disabled={submitting}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-100"
        />
        <div className="mt-2">
          <p className="text-[11px] text-slate-500 font-semibold mb-1">Quick preset sample images:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '🍕 Pizza', url: '/images/product_pizza_margherita.jpg' },
              { label: '🍔 Burger', url: '/images/product_burger_deluxe.jpg' },
              { label: '🍝 Pasta', url: '/images/product_pasta_carbonara.jpg' },
              { label: '🍣 Sushi', url: '/images/product_sushi_platter.jpg' },
              { label: '🥗 Salad', url: '/images/product_caesar_salad.jpg' },
              { label: '🍰 Dessert', url: '/images/product_chocolate_lava_cake.jpg' },
            ].map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-orange-100 hover:text-orange-700 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Note: If left blank, a default food image will automatically be assigned based on the category or dish name.
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed dish description, ingredients, dietary information..."
          disabled={submitting}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-slate-100"
        />
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center gap-3 pt-1">
        <input
          type="checkbox"
          id="available"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          disabled={submitting}
          className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 disabled:opacity-50"
        />
        <label htmlFor="available" className="text-sm font-semibold text-slate-800 select-none">
          Available for Ordering
        </label>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-orange-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {submitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
