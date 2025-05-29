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
  output: 'export', // Static export için
  trailingSlash: true, // URL'lerde trailing slash
  basePath: '', // Base path boş
};

export default nextConfig;
