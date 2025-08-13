import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Function to get CSRF token from cookie
const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(';').shift();
    return token ? decodeURIComponent(token) : null;
  }
  return null;
};

// Function to get CSRF token
const getCsrfToken = async (): Promise<void> => {
  try {
    await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // For non-GET requests, ensure we have a CSRF token
    if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      // Skip CSRF token for specific endpoints
      if (!config.url?.includes('/sanctum/csrf-cookie')) {
        try {
          // First, try to get CSRF token from cookie
          let csrfToken = getCsrfTokenFromCookie();
          
          // If no token in cookie, fetch it
          if (!csrfToken) {
            await getCsrfToken();
            csrfToken = getCsrfTokenFromCookie();
          }
          
          // Add CSRF token to headers
          if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
          }
        } catch (error) {
          console.error('Failed to get CSRF token:', error);
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get fresh CSRF token
        await getCsrfToken();
        
        // Get the new token from cookie and add to headers
        const csrfToken = getCsrfTokenFromCookie();
        if (csrfToken) {
          originalRequest.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        
        // Retry the original request
        return api(originalRequest);
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError);
        return Promise.reject(error);
      }
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest.url?.includes('/api/auth/')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    }
    
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;