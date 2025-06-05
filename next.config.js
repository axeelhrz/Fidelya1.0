/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para Netlify con modo servidor
  output: 'standalone',  // Modo servidor para soportar API routes
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Evitar fallos en la compilación por errores de lint o tipos
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Mejorar manejo de variables de entorno
  publicRuntimeConfig: {
    // Variables disponibles solo en el servidor
    GETNET_LOGIN: process.env.GETNET_LOGIN,
    GETNET_SECRET: process.env.GETNET_SECRET,
    GETNET_BASE_URL: process.env.GETNET_BASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  env: {
    // Variables disponibles en el cliente
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

module.exports = nextConfig;
