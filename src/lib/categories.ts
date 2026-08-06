import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Blog } from "@/types/blog";
import { getAllBlogsSorted } from "@/lib/loadBlogs";

export interface CategoryMeta {
  slug: string;
  name: string;
  description: string;
}

export interface CategoryWithStats extends CategoryMeta {
  postCount: number;
  latestTitle?: string;
  latestSlug?: string;
}

const TAGS_PATH = path.resolve(process.cwd(), "./content/meta/tags.yml");

export function loadCategoryMeta(): CategoryMeta[] {
  const file = fs.readFileSync(TAGS_PATH, "utf8");
  const data = yaml.load(file) as {
    tags: { slug: string; name: string; description?: string }[];
  };

  return data.tags.map((t) => ({
    slug: t.slug,
    name: t.name,
    description:
      t.description?.trim() ||
      `Articles and tutorials about ${t.name} for Sitecore and .NET developers.`,
  }));
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return loadCategoryMeta().find(
    (t) => t.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function blogMatchesCategory(blog: Blog, categorySlug: string): boolean {
  if (!blog.category) return false;
  const categories = Array.isArray(blog.category)
    ? blog.category
    : typeof blog.category === "string"
      ? [blog.category]
      : [];
  return categories.some(
    (cat) => cat.toLowerCase() === categorySlug.toLowerCase()
  );
}

export function getBlogsForCategory(categorySlug: string): Blog[] {
  return getAllBlogsSorted().filter((blog) =>
    blogMatchesCategory(blog, categorySlug)
  );
}

export function getCategoriesWithStats(): CategoryWithStats[] {
  const blogs = getAllBlogsSorted();
  return loadCategoryMeta().map((meta) => {
    const matched = blogs.filter((blog) =>
      blogMatchesCategory(blog, meta.slug)
    );
    const latest = matched[0];
    return {
      ...meta,
      postCount: matched.length,
      latestTitle: latest?.title,
      latestSlug: latest?.slug,
    };
  });
}
