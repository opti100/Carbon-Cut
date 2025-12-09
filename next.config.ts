import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

     domains: [
          "api.microlink.io", // Microlink Image Preview
        ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: '',
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: '',
        pathname: "/**"
      },
    
       
   
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://api.rishiii.me'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
          },
        ]
      }
    ]
  }
};

export default nextConfig;
