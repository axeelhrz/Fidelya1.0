import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"], // Añade aquí los dominios de imágenes externas si los necesitas
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Configuración para PWA si decides implementarla
  // pwa: {
  //   dest: "public",
  //   register: true,
  //   skipWaiting: true,
  // },
};

export default nextConfig;
