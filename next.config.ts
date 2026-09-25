import type { NextConfig } from 'next';

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trendupp-assets.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trendupp-s3-bucket.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,
  allowedDevOrigins,
  async redirects() {
    return [
      // Pandascrow's escrow checkout redirects back to a doubled path
      // (`/payment/success/success?...`) instead of `/payment/success?...`,
      // which 404s. Fold it back onto the real route, preserving the query
      // string (status/type/ref/checkout_id) the success page needs. Kept as a
      // temporary (non-permanent) redirect so it stops being cached once the
      // backend callback_url is corrected.
      {
        source: '/payment/success/success',
        destination: '/payment/success',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
