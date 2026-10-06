import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CategoryModal from '../../components/admin/CategoryModal';
import DeleteConfirmation from '../../components/admin/DeleteConfirmation';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { getCategories, getProducts } from '../../services/productService';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService';

/**
 * AdminCategoriesPage Component
 * Full category management page for Admins.
 * Features:
 * - Category list/table with name, description, associated product count, actions
 * - Add & Edit category in modal
 * - Delete category feature with confirmation dialog & product constraint checks
 * - Feedback banners (success, warning, error)
 */
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter
  const [search, setSearch] = useState('');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active items for actions
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Action loading state
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback notifications
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showFeedback = (type, message) => {
    setFeedbackMessage({ type, message });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        getCategories(),
        getProducts({ size: 100 }).catch(() => ({ content: [] })),
      ]);

      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      const productList = productsRes?.content || (Array.isArray(productsRes) ? productsRes : []);
      setProducts(productList);
    } catch (err) {
      console.error('Failed to load categories:', err);
      const msg = err.response?.data?.message || 'Failed to fetch categories data. Please check your backend connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Product counts per category map (by ID and by Name)
  const productCountMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const catId = p.category?.id != null ? String(p.category.id) : (p.categoryId != null ? String(p.categoryId) : null);
      if (catId) {
        map[catId] = (map[catId] || 0) + 1;
      }
      const catName = typeof p.category === 'string' ? p.category.toLowerCase() : (p.category?.name || '').toLowerCase();
      if (catName) {
        map[catName] = (map[catName] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        cat.name?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q)
      );
    });
  }, [categories, search]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (payload, id) => {
    if (id) {
      // Update
      const updated = await updateCategory(id, payload);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      showFeedback('success', `Category "${updated.name || payload.name}" updated successfully!`);
    } else {
      // Create
      const created = await createCategory(payload);
      setCategories((prev) => [...prev, created]);
      showFeedback('success', `Category "${created.name || payload.name}" created successfully!`);
    }
  };

  const handleOpenDeleteModal = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      showFeedback('success', `Category "${deletingCategory.name}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      const isConflict = err.response?.status === 409;
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      const msg = isConflict
        ? `Cannot delete category "${deletingCategory.name}" because it contains active products. Please reassign or remove those products first.`
        : (serverMsg || 'Failed to delete category. Please try again.');
      
      showFeedback('error', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading categories..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Feedback Banner */}
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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Category Management
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Organize FoodHub products into distinct menu categories
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
        >
          + Add New Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search categories by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          title="No categories found"
          message={
            search
              ? 'No categories matched your search term.'
              : 'Get started by creating your first food category.'
          }
          actionLabel={search ? 'Clear Search' : '+ Add First Category'}
          onAction={search ? () => setSearch('') : handleOpenAddModal}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Assigned Products</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCategories.map((cat) => {
                  const count = cat.productCount !== undefined && cat.productCount !== null
                    ? Number(cat.productCount)
                    : (productCountMap[String(cat.id)] || productCountMap[cat.name?.toLowerCase()] || 0);
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs">
                        {cat.description || <span className="italic text-slate-300">No description provided</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            count > 0
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span>{count} product{count === 1 ? '' : 's'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(cat)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      {/* Delete Category Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        title="Delete Category"
        itemName={deletingCategory?.name || ''}
        confirmLabel="Delete Category"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingCategory(null);
        }}
        deleting={isDeleting}
      />

    </div>
  );
}
