/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
