import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")], // Adjust the path to your styles folder as needed
  },
  env: {
    NEXT_PUBLIC_COMMENTBOX_PROJECT_ID:
      process.env.NEXT_PUBLIC_COMMENTBOX_PROJECT_ID,
  },
  basePath: "", // Replace with the name of your GitHub repository
  assetPrefix: "", // Same as the basePath
  trailingSlash: false,
  output: "export",
};

export default nextConfig;
