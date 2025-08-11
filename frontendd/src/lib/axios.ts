import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Simplified request interceptor - get CSRF token before each request
api.interceptors.request.use(
  async (config) => {
    // Always get CSRF token before any request to ensure fresh token
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001'}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;