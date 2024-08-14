/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sticker-be.getonnet.dev',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/editor/:path*',
        destination: '/editor',
      },
    ];
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'commonjs canvas' }];
    return config;
  },
};

export default nextConfig;
