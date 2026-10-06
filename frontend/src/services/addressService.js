import apiClient from './apiClient';

export async function getAddresses() {
  const response = await apiClient.get('/addresses');
  return response.data;
}

export async function createAddress(addressData) {
  const response = await apiClient.post('/addresses', addressData);
  return response.data;
}
