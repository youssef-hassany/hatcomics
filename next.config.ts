import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-f34b4d53fd6f497180254197682d3a25.r2.dev",
      },
      {
        protocol: "https",
        hostname: "comicvine.gamespot.com",
      },
    ],
  },
};

export default nextConfig;
