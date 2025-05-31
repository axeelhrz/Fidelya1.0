// Configuración de la aplicación
const config = {
  // URL base de la API - ACTUALIZADA AL NUEVO PUERTO
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  
  // Configuración JWT
  JWT_STORAGE_KEY: 'token',
  REMEMBER_USER_KEY: 'rememberUser',
  
  // Configuración de la aplicación
  APP_NAME: 'Frutería Nina',
  APP_VERSION: '1.0.0',
  
  // Timeouts
  REQUEST_TIMEOUT: 10000, // 10 segundos
  
  // Configuración de validación
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};

export default config;