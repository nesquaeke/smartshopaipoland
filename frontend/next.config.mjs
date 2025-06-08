/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3535',
    NODE_ENV: process.env.NODE_ENV || 'development'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3535'}/api/:path*`,
      },
    ];
  },
  // Enable static exports for better performance
  trailingSlash: true,
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // Enable compression
  compress: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig; 