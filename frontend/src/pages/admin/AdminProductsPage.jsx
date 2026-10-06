import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';
import ProductModal from '../../components/admin/ProductModal';
import DeleteConfirmation from '../../components/admin/DeleteConfirmation';
import CategoryModal from '../../components/admin/CategoryModal';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { getProducts, getCategories } from '../../services/productService';
import { createProduct, updateProduct, deleteProduct, createCategory } from '../../services/adminService';

/**
 * AdminProductsPage Component
 * Full product catalog management page for Admins.
 * Features:
 * - Product list/table with image, name, category, price, stock, availability, actions
 * - Add/Edit Product forms in modal with client & server validation
 * - Delete product with confirmation modal
 * - Availability toggle
 * - Search by name/description
 * - Filter by category and availability
 * - Success feedback toasts/alerts for Create, Update, Delete
 * - Comprehensive backend error handling
 */
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // Modals & Dialogs State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active items for actions
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Action status states
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showFeedback = (type, message) => {
    setFeedbackMessage({ type, message });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({ size: 100 }),
        getCategories(),
      ]);

      const productList = productsRes?.content || (Array.isArray(productsRes) ? productsRes : []);
      setProducts(productList);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
    } catch (err) {
      console.error('Failed to load products or categories:', err);
      const msg = err.response?.data?.message || 'Failed to fetch catalog data. Please verify your backend server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !search.trim() ||
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' ||
        String(product.category?.id) === String(selectedCategory);

      const matchesAvailability =
        availabilityFilter === 'ALL' ||
        (availabilityFilter === 'AVAILABLE' && product.available) ||
        (availabilityFilter === 'UNAVAILABLE' && !product.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, selectedCategory, availabilityFilter]);

  // --- Handlers ---

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (payload, id) => {
    setSavingProduct(true);
    setProductFormError(null);
    try {
      if (id) {
        // Update product
        const updated = await updateProduct(id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
        showFeedback('success', `Product "${updated.name || payload.name}" updated successfully!`);
      } else {
        // Create product
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
        showFeedback('success', `Product "${created.name || payload.name}" created successfully!`);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? 'Access denied. Only ADMIN users can manage products.'
          : err.message || 'Failed to save product.');
      setProductFormError(msg);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleOpenDeleteModal = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showFeedback('success', `Product "${deletingProduct.name}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? 'Access denied. Only ADMIN users can delete products.'
          : 'Failed to delete product. It may be linked to existing orders.');
      showFeedback('error', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const payload = {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        available: !product.available,
        categoryId: product.category?.id,
      };
      const updated = await updateProduct(product.id, payload);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p))
      );
      showFeedback(
        'success',
        `Product "${product.name}" marked as ${updated.available ? 'Available' : 'Unavailable'}.`
      );
    } catch (err) {
      console.error('Error toggling availability:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? 'Access denied. Only ADMIN users can update products.'
          : 'Failed to update product availability.');
      showFeedback('error', msg);
    }
  };

  const handleSaveCategory = async (categoryPayload) => {
    try {
      const created = await createCategory(categoryPayload);
      setCategories((prev) => [...prev, created]);
      showFeedback('success', `Category "${created.name}" created successfully!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create category.';
      showFeedback('error', msg);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setAvailabilityFilter('ALL');
  };

  if (loading) {
    return <LoadingState message="Loading product inventory..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Alert / Feedback Notification Banner */}
      {feedbackMessage && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold border transition shadow-sm flex items-center justify-between ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedbackMessage.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{feedbackMessage.message}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Page Action Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Product Management
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Add, update, search, and manage FoodHub products & stock
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/categories"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            Manage Categories
          </Link>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            + New Category
          </button>
          <button
            onClick={handleOpenAddModal}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:grid-cols-12">
        
        {/* Search Input */}
        <div className="sm:col-span-6">
          <label className="sr-only">Search Products</label>
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <label className="sr-only">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="sm:col-span-3">
          <label className="sr-only">Filter by Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="ALL">All Availability</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="UNAVAILABLE">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: ProductTable or EmptyState */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          message={
            search || selectedCategory !== 'ALL' || availabilityFilter !== 'ALL'
              ? 'No products matched your search or category criteria.'
              : 'Start by creating your first product.'
          }
          actionLabel={
            search || selectedCategory !== 'ALL' || availabilityFilter !== 'ALL'
              ? 'Reset Filters'
              : '+ Add First Product'
          }
          onAction={
            search || selectedCategory !== 'ALL' || availabilityFilter !== 'ALL'
              ? handleResetFilters
              : handleOpenAddModal
          }
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onToggleAvailability={handleToggleAvailability}
        />
      )}

      {/* Reusable Product Create/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        submitting={savingProduct}
        error={productFormError}
      />

      {/* Reusable Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        productName={deletingProduct?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingProduct(null);
        }}
        deleting={isDeleting}
      />

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

    </div>
  );
}
