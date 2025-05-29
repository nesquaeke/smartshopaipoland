/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint hatalarını build sırasında görmezden gel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hatalarını build sırasında görmezden gel
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig; 