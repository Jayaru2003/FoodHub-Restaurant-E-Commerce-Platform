import apiClient from './apiClient';

export async function getProducts(params = {}) {
  // Clean parameters (remove undefined, null, or empty string values)
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val !== undefined && val !== null && val !== '') {
      cleanParams[key] = val;
    }
  });

  const response = await apiClient.get('/products', {
    params: {
      page: 0,
      size: 12,
      ...cleanParams
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

