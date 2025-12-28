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
    // Permitir imágenes locales desde public/
    domains: [],
  },
  // Asegurar que los archivos estáticos se sirvan correctamente
  output: 'standalone',
};

export default nextConfig;

