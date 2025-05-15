/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? bundleAnalyzer({ enabled: true })
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

export default withBundleAnalyzer(nextConfig);