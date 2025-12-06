import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Main API server for uploads
      {
        protocol: 'https',
        hostname: 'api.sahara2797.com',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Allow any external image sources (for news articles from various sources)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Proxy API requests to backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
