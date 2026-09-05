import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com", protocol: "https", port: "" },
      {
        hostname: "strong-marlin-123.eu-west-1.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
  cacheComponents: true,
};

export default nextConfig;
