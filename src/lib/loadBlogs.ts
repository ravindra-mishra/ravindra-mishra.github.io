import fs from "fs";
import path from "path";
import matter from "gray-matter";
import removeMd from "remove-markdown";
import type { Blog } from "@/types/blog";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

function tagSlugsFromFrontmatter(
  tags: unknown
): string[] | undefined {
  if (!Array.isArray(tags) || tags.length === 0) return undefined;
  return tags.map((tag: string | { tag: string }) =>
    typeof tag === "object" && tag !== null ? tag.tag : tag
  );
}

/** Loads all markdown posts from `content/blogs`, newest first. */
export function getAllBlogsSorted(): Blog[] {
  const files = fs.readdirSync(BLOGS_DIR).filter((f) => f.endsWith(".md"));

  const blogs: Blog[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const file = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf8");
    const matterData = matter(file);
    const plainTextContent = removeMd(matterData.content as string);
    const words = plainTextContent.split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.ceil(words / 200)} min read`;

    return {
      title: matterData.data.title as string,
      excerpt:
        (matterData.data.excerpt as string | undefined) ||
        plainTextContent.slice(0, 150) +
          (plainTextContent.length > 150 ? "..." : ""),
      category: tagSlugsFromFrontmatter(matterData.data.tags),
      date: matterData.data.date as string | Date,
      readTime,
      iconClass: "",
      featuredImage: (matterData.data.featuredImage as string) || "",
      url: `/blogs/${slug}`,
      featured: Boolean(matterData.data.featured),
      content: plainTextContent,
      slug,
    };
  });

  blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return blogs;
}
