import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xserver（共用サーバー）はNode.js常駐不可のため静的書き出し
  output: "export",
  trailingSlash: true,
  images: {
    // 画像最適化サーバーが無いため無効化
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
