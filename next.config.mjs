/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sticker-be.getonnet.dev',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'commonjs canvas' }];
    return config;
  },
};

export default nextConfig;
