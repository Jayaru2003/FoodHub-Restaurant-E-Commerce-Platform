import apiClient from './apiClient';

export async function getProducts(params = {}) {
  const response = await apiClient.get('/products', {
    params: {
      page: 0,
      size: 12,
      available: true,
      ...params
    }
  });

  return response.data;
}

export async function getProductById(id) {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await apiClient.get('/categories');
  return response.data;
}
