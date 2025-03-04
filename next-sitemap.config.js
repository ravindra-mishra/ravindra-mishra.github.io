const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://ravindra-mishra.github.io", // Replace with your site's URL
  generateRobotsTxt: true, // (optional) Generate a robots.txt file
  exclude: [], // Add paths to exclude from the sitemap if necessary
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
