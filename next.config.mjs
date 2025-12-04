import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.sahara2797.com',
      },
      {
        protocol: 'https',
        hostname: 'bahethoarabia.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.hespress.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.hespress.com',
      },
      {
        protocol: 'https',
        hostname: 'i3.hespress.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.hespress.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withNextIntl(nextConfig);
