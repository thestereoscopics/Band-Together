import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "earlfwztccllwwyoqwrr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
      {
        protocol: "https",
        hostname: "i.discogs.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "st.discogs.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // output: "export",
};

export default nextConfig;
