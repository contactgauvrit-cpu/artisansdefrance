import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Formats modernes pour de meilleurs Core Web Vitals
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
