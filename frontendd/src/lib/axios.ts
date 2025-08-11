import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Temporarily disable interceptors to debug the infinite reload issue
// Request interceptor to get CSRF token before requests
// api.interceptors.request.use(
//   async (config) => {
//     // Get CSRF token for state-changing requests
//     if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
//       try {
//         await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001'}/sanctum/csrf-cookie`, {
//           withCredentials: true,
//         });
//       } catch (error) {
//         console.error('Failed to get CSRF token:', error);
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect automatically to prevent loops
      console.log('401 Unauthorized - user needs to login');
    }
    return Promise.reject(error);
  }
);

export default api;