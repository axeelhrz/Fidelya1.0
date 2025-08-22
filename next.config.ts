import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Disable telemetry for faster builds
  telemetry: false,
  
  // Optimize builds
  swcMinify: true,
  
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Image optimization
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@': path.resolve(__dirname, 'src'),
      };
    }
    
    // Reduce bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Optimize for Vercel deployment
  trailingSlash: false,
  
  // Handle TypeScript errors during build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Handle ESLint errors during build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;