import apiClient from './apiClient';

/**
 * Admin API services for Orders, Products, and Categories.
 * Requires ADMIN role JWT authorization header.
 */

// ── Orders API ─────────────────────────────────────────────

export async function getAdminOrders() {
  const response = await apiClient.get('/admin/orders');
  return response.data;
}

export async function getAdminOrderById(id) {
  const response = await apiClient.get(`/admin/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
}

export async function updatePaymentStatus(id, status) {
  const response = await apiClient.patch(`/admin/orders/${id}/payment-status`, { status });
  return response.data;
}

// ── Products API ───────────────────────────────────────────

export async function createProduct(productData) {
  const response = await apiClient.post('/products', productData);
  return response.data;
}

export async function updateProduct(id, productData) {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`);
}

// ── Categories API ─────────────────────────────────────────

export async function createCategory(categoryData) {
  const response = await apiClient.post('/categories', categoryData);
  return response.data;
}

export async function updateCategory(id, categoryData) {
  const response = await apiClient.put(`/categories/${id}`, categoryData);
  return response.data;
}

export async function deleteCategory(id) {
  await apiClient.delete(`/categories/${id}`);
}
