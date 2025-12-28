import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    // Permitir imágenes locales sin optimización para evitar problemas
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

