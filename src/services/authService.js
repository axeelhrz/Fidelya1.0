import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = 'http://localhost:5000/api'; // Ajusta según tu backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Configurar token de autenticación
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Remover token de autenticación
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/verify-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};