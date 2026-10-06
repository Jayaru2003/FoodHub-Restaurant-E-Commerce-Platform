import apiClient from './apiClient';

export async function createOrder(orderData) {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
}

export async function getMyOrders() {
  const response = await apiClient.get('/orders');
  return response.data;
}

export async function getOrderById(id) {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
}
