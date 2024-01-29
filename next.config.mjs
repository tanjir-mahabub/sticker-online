/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/editor/:path*',
            destination: '/editor',
          },
        ];
      },
      webpack: (config) => {
        config.externals = [...config.externals, { canvas: 'canvas' }];
        return config;
      },
};

export default nextConfig;
