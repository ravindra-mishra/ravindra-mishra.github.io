const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

/** @type {import('next-sitemap').IConfig} */
const defaultProdUrl = "https://ravindra-mishra.github.io";
const rawEnv = process.env.NEXT_PUBLIC_BASE_URL;
const siteUrl =
  rawEnv &&
  !/^https?:\/\/localhost\b/i.test(rawEnv) &&
  !/^https?:\/\/127\./i.test(rawEnv)
    ? rawEnv.replace(/\/$/, "")
    : defaultProdUrl;

const LOW_PRIORITY_PATHS = new Set(["/privacy", "/contact"]);
const MEDIUM_PRIORITY_PATHS = new Set([
  "/about",
  "/portfolio",
  "/categories",
]);

/**
 * Prefer frontmatter modifiedDate / date; fall back to file mtime.
 * @param {string} filePath
 * @param {Record<string, unknown>} data
 */
function blogLastmod(filePath, data) {
  const fromMatter = data.modifiedDate || data.date;
  if (fromMatter) {
    const parsed = new Date(/** @type {string | Date} */ (fromMatter));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return fs.statSync(filePath).mtime.toISOString();
}

const config = {
  siteUrl,
  /** Write into `out/` after `next build` export — do not rely on `public/` copy (would stay stale). */
  outDir: "out",
  /** One `sitemap.xml` with all URLs — fewer moving parts for crawlers than a sitemap index. */
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  /** Google largely ignores changefreq; omit noisy daily values. */
  changefreq: false,
  exclude: ["/admin", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
  },
  transform: async (cfg, loc) => {
    let priority = 0.7;
    if (loc === "/") {
      priority = 1.0;
    } else if (loc.startsWith("/blogs/") && loc !== "/blogs") {
      priority = 0.8;
    } else if (loc === "/blogs") {
      priority = 0.9;
    } else if (LOW_PRIORITY_PATHS.has(loc)) {
      priority = 0.3;
    } else if (MEDIUM_PRIORITY_PATHS.has(loc) || loc.startsWith("/categories/")) {
      priority = 0.5;
    }

    return {
      loc,
      lastmod: cfg.autoLastmod ? new Date().toISOString() : undefined,
      priority,
    };
  },
  additionalPaths: async () => {
    const blogsDir = "./content/blogs";
    const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));

    return files.map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(blogsDir, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);

      return {
        loc: `/blogs/${slug}`,
        lastmod: blogLastmod(filePath, data),
        priority: 0.8,
      };
    });
  },
};

module.exports = config;
