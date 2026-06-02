import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Formats modernes pour de meilleurs Core Web Vitals
    formats: ["image/avif", "image/webp"],
  },
  // Redirections 301 des anciens services retirés du catalogue
  async redirects() {
    return [
      { source: "/piscine", destination: "/amenagement-exterieur", permanent: true },
      { source: "/piscine/:commune", destination: "/amenagement-exterieur/:commune", permanent: true },
      { source: "/renovation-generale", destination: "/", permanent: true },
      { source: "/renovation-generale/:commune", destination: "/", permanent: true },
      { source: "/amenagement-interieur", destination: "/", permanent: true },
      { source: "/amenagement-interieur/:commune", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
