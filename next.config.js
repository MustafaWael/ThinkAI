/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/chat/new-chat",
        },
      ],
    };
  },
};

module.exports = nextConfig;
