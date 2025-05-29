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
  // Vercel için normal deployment - static export gerekmez
  trailingSlash: true, // SEO için
};

export default nextConfig;
