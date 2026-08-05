import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactStrictMode: false,

  // Enable compression for all responses
  compress: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Output formats — AVIF is smallest, WebP is broad support fallback
    formats: ['image/avif', 'image/webp'],
    // Common device widths for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '47.128.222.47',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '47.128.222.47',
        pathname: '/storage/**',
      },
    ],
    // Allow SVG images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self' https://via.placeholder.com;",
    // ✅ Image optimization ENABLED — do NOT set unoptimized: true
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
