import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        hostname: "via.assets.so"
      },
      {
        hostname: "res.cloudinary.com"
      }
    ],
  },
};

export default nextConfig;
