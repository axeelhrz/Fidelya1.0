import axios from 'axios';
// Fix the import - change from named import to default import
import config from '../config/config';

class CierreCajaService {
  constructor() {
    this.baseURL = `${config.API_BASE_URL}/api/cierre-caja`;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Configurar interceptores de axios
  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(config.JWT_STORAGE_KEY || 'token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(config.JWT_STORAGE_KEY || 'token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ... rest of existing code remains unchanged
}

// Crear instancia única del servicio
const cierreCajaService = new CierreCajaService();

// Configurar interceptores al crear la instancia
cierreCajaService.setupInterceptors();
export { cierreCajaService };