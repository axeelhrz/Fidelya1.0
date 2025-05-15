import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 🔴 Desactiva Turbopack en producción
    // turbo: {} // Solo para desarrollo
  },
  // Optimizaciones para producción
  // swcMinify ya no es necesario en Next.js 15.2.4, se usa por defecto
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
  // Añadir optimización de paquetes
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones solo para producción
    if (!dev && !isServer) {
      // Optimizar chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next|@next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          mui: {
            name: 'mui-chunk',
            test: /[\\/]node_modules[\\/](@mui)[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'async',
            name(module: { context: string }) {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'unknown';
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 10,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
