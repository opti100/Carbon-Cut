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
  }
};

export default nextConfig;
