import apiClient from './apiClient';

export async function loginApi(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

export async function registerApi(userData) {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
}
