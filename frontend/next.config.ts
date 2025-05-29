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
  output: 'export', // Static export for GitHub Pages
  trailingSlash: true, // GitHub Pages için
  basePath: '/smartshopaipoland', // GitHub repository adı
  assetPrefix: '/smartshopaipoland/', // Asset'ler için prefix
  distDir: 'out', // GitHub Actions için out klasörü
};

export default nextConfig;
