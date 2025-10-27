import type { NextConfig } from "next";
import { Protocol } from "puppeteer";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"i.pravatar.cc",
        port:'',
        pathname:"/**"
      }
    ]
  },
  async rewrites() {
      return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
