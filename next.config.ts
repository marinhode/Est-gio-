import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    // Fotos enviadas pelo painel ficam no armazenamento do Supabase
    remotePatterns: [{ protocol: 'https', hostname: 'hmmrthhwchefxwshpphl.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
