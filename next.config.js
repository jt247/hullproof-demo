/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: true },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = [...(config.externals ?? []), { "node:sqlite": "commonjs node:sqlite" }];
    }
    return config;
  },
};

module.exports = nextConfig;
