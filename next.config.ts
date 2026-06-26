import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,
  allowedDevOrigins: ['petronila-caryophyllaceous-taintlessly.ngrok-free.dev'],
};

export default nextConfig;
