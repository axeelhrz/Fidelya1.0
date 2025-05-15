/** @type {import('next').NextConfig} */

// Using dynamic import for bundle analyzer
const withBundleAnalyzer = async () => {
  if (process.env.ANALYZE === 'true') {
    const { default: bundleAnalyzer } = await import('@next/bundle-analyzer');
    return bundleAnalyzer({ enabled: true });
  }
  return (config) => config;
};

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Optimización: Configurar transpilación para reducir tamaño de bundle
  transpilePackages: ['@phosphor-icons/react'],
  // Optimización: Configurar compresión de imágenes
};

// Export configuration
module.exports = async () => {
  const analyzer = await withBundleAnalyzer();
  return analyzer(nextConfig);
};