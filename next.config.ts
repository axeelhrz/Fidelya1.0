import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 🔴 Desactiva Turbopack en producción
    // turbo: {} // Solo para desarrollo
  },
  // Optimizaciones para producción
  swcMinify: true, // Usar SWC para minificación (más rápido que Terser)
  compiler: {
    // Eliminar console.logs en producción
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Optimización de módulos
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/dist/ssr/{{member}}',
    },
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },
};

export default nextConfig;
