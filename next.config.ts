import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.149",
        port: "7878",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.0.149",
        port: "8989",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
