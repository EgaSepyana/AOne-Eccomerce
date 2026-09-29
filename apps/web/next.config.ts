import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  images: {
    qualities: [75, 90, 100],
    contentDispositionType: "inline",
  },
};

export default nextConfig;
