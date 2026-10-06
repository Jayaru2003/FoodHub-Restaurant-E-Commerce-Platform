import React, { useState, useEffect, useMemo } from 'react';
import StatusBadge from '../../components/admin/StatusBadge';
import ProductModal from '../../components/admin/ProductModal';
import CategoryModal from '../../components/admin/CategoryModal';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { getProducts, getCategories } from '../../services/productService';
import { createProduct, updateProduct, deleteProduct, createCategory } from '../../services/adminService';

/**
 * AdminProductsPage Component
 * Full product catalog management (Create, Read, Update, Delete, Availability Toggle).
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

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
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
      console.error('Failed to load products page data:', err);
      setError('Failed to fetch products or categories. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products
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

  // Actions
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (payload, id) => {
    if (id) {
      const updated = await updateProduct(id, payload);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
    } else {
      const created = await createProduct(payload);
      setProducts((prev) => [created, ...prev]);
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
    } catch (err) {
      alert('Failed to update product availability');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product.';
      alert(msg);
    }
  };

  const handleSaveCategory = async (categoryPayload) => {
    const created = await createCategory(categoryPayload);
    setCategories((prev) => [...prev, created]);
  };

  if (loading) {
    return <LoadingState message="Loading products inventory..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Title & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Products & Catalog
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Create, update, and manage menu items and stock availability
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            + New Category
          </button>
          <button
            onClick={handleOpenAddModal}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-orange-600/30 hover:bg-orange-700 transition"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:grid-cols-12">
        {/* Search */}
        <div className="sm:col-span-6">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
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
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
          >
            <option value="ALL">All Availability</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="UNAVAILABLE">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            message={
              search || selectedCategory !== 'ALL' || availabilityFilter !== 'ALL'
                ? 'Try adjusting your search criteria or category filter.'
                : 'Get started by adding your first product to the FoodHub menu.'
            }
            actionLabel={!products.length ? '+ Add First Product' : undefined}
            onAction={!products.length ? handleOpenAddModal : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Image & Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl || '/images/product_burger_deluxe.jpg'}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/product_burger_deluxe.jpg';
                          }}
                        />
                        <div>
                          <p className="font-extrabold text-slate-900">{product.name}</p>
                          <p className="line-clamp-1 text-xs text-slate-500 max-w-xs">
                            {product.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-xs font-bold text-slate-600">
                      <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-extrabold text-slate-900">
                      ${Number(product.price || 0).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-xs font-bold">
                      <span className={product.stockQuantity < 5 ? 'text-rose-600 font-black' : 'text-slate-700'}>
                        {product.stockQuantity ?? 'N/A'} units
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product)}
                        title="Click to toggle availability"
                      >
                        <StatusBadge status={product.available} type="availability" />
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
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
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

    </div>
  );
}
