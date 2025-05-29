import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint hatalarını build sırasında yoksay
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript hatalarını build sırasında yoksay  
  },
  images: {
    unoptimized: true, // Image optimization'ı kapat (deployment için)
  },
  // Static export'u kaldır, normal build yap
  // output: 'export',
  distDir: 'build', // Netlify için build klasörü
};

export default nextConfig;
