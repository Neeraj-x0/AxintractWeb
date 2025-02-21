import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        hostname: "via.assets.so"
      },
      {
        hostname: "res.cloudinary.com"
      },
      {
      hostname: "localhost"
      },
      {
        hostname : "api.axintract.com"
      },
      {
        hostname: "cdn-icons-png.flaticon.com"
      }
    ],
  },
};

export default nextConfig;
