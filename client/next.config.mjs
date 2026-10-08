/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5000/api/v1/:path*',
      },
      {
        source: '/health',
        destination: 'http://localhost:5000/health',
      },
      {
        source: '/email-preview',
        destination: 'http://localhost:5000/email-preview',
      },
      {
        source: '/test-api',
        destination: 'http://localhost:5000/test-api',
      },
    ];
  },
};

export default nextConfig;
