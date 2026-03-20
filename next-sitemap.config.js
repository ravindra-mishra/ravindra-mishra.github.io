const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
const defaultProdUrl = "https://ravindra-mishra.github.io";
const rawEnv = process.env.NEXT_PUBLIC_BASE_URL;
const siteUrl =
  rawEnv &&
  !/^https?:\/\/localhost\b/i.test(rawEnv) &&
  !/^https?:\/\/127\./i.test(rawEnv)
    ? rawEnv.replace(/\/$/, "")
    : defaultProdUrl;

const config = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
  exclude: [],
  additionalPaths: async () => {
    const blogsDir = "./content/blogs";
    const files = fs.readdirSync(blogsDir);

    // Generate URLs with last modified date
    return files.map((filename) => {
      const slug = filename.replace(/\.md$/, ""); // Remove .md extension
      const filePath = path.join(blogsDir, filename);

      // Get the file's last modified time
      const stats = fs.statSync(filePath);
      const lastModified = stats.mtime.toISOString(); // Convert to ISO format

      return {
        loc: `/blogs/${slug}`, // Blog URL
        lastmod: lastModified, // Last modified date
      };
    });
  },
};

module.exports = config;
