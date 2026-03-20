import type { NextConfig } from "next";
import path from "path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")], // Adjust the path to your styles folder as needed
  },
  env: {
    NEXT_PUBLIC_COMMENTBOX_PROJECT_ID:
      process.env.NEXT_PUBLIC_COMMENTBOX_PROJECT_ID,
  },
  basePath,
  assetPrefix: basePath,
  trailingSlash: false,
  output: "export",
};

export default nextConfig;
