import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Earth Engine can take well over the proxy's default 30 seconds on large fields
    proxyTimeout: 120_000,
  },
  // the satellite service (backend/main.py) is reached through the app so it stays same-origin
  async rewrites() {
    const target = process.env.SATELLITE_API_URL ?? "http://127.0.0.1:8001";
    return [{ source: "/api/satellite/:path*", destination: `${target}/api/:path*` }];
  },
};

export default nextConfig;

