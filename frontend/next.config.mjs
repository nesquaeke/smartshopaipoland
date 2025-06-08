/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://smartshopai-backend.onrender.com',
  },
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/smartshopaipoland' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/smartshopaipoland/' : '',
  // Enable static exports for better performance
  trailingSlash: true,
  // Optimize images
  images: {
    unoptimized: true
  },
  // Enable compression
  compress: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig; 