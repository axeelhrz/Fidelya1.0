import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // 🔴 Desactiva Turbopack
    // turbo: {} // Uncomment and configure if needed
  },
};

export default nextConfig;
