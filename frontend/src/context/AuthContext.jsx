import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { loginApi, registerApi } from '../services/authService';

const TOKEN_KEY = 'foodhub_token';
const USER_KEY = 'foodhub_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY) || null;
    if (storedToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    return storedToken;
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Synchronize axios authorization header with current token state
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    if (data.token) {
      const userPayload = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      setToken(data.token);
      setUser(userPayload);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userPayload));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await registerApi(userData);
    if (data.token) {
      const userPayload = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      setToken(data.token);
      setUser(userPayload);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userPayload));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } else {
      // Fallback: auto login if register response didn't include token
      await login({ email: userData.email, password: userData.password });
    }
    return data;
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
