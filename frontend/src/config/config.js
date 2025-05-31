const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  JWT_SECRET: process.env.REACT_APP_JWT_SECRET || 'tu_clave_secreta_muy_segura_para_jwt',
  APP_NAME: 'Frutería Nina',
  APP_VERSION: '1.0.0',
};

export default config;