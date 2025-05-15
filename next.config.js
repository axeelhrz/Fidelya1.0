/** @type {import('next').NextConfig} */

const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Optimización: Configurar transpilación para reducir tamaño de bundle
  transpilePackages: ['@phosphor-icons/react'],
  // Optimización: Configurar compresión de imágenes
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'framer-motion'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);