/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Add this line to ignore ESLint errors during builds
  },
  async rewrites() {
    return [
      {
        source: "/:slug", // Match any single path segment as a slug
        destination: "/component/:slug", // Redirect to the component folder
      },
    ];
  },
};
