import Link from "next/link";
import type { FC } from "react";
import type { Blog } from "@/types/blog";

export interface BlogPostsGridProps {
  blogs: Blog[];
  emptyMessage?: string;
}

function formatPostDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const BlogPostsGrid: FC<BlogPostsGridProps> = ({
  blogs,
  emptyMessage = "No articles found.",
}) => {
  if (!blogs.length) {
    return <p className="category-empty">{emptyMessage}</p>;
  }

  return (
    <div className="posts-grid">
      {blogs.map((blog) => (
        <article key={blog.slug} className="post-card">
          <div
            className="post-image"
            style={{
              backgroundImage: `
                linear-gradient(
                  45deg,
                  rgba(44, 82, 130, 0.5),
                  rgba(66, 153, 225, 0.2)
                ),
                url(${blog.featuredImage || ""})
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden="true"
          />
          <div className="post-content">
            <div className="post-meta">
              {blog.category?.[0] ? (
                <span className="post-category">{blog.category[0]}</span>
              ) : null}
              <span>
                <i className="fas fa-calendar" aria-hidden="true" />{" "}
                {formatPostDate(blog.date)}
              </span>
              {blog.readTime ? (
                <span>
                  <i className="fas fa-clock" aria-hidden="true" />{" "}
                  {blog.readTime}
                </span>
              ) : null}
            </div>
            <Link href={blog.url ?? `/blogs/${blog.slug}`}>
              <h2 className="post-title">{blog.title}</h2>
            </Link>
            {blog.excerpt ? (
              <p className="post-excerpt">{blog.excerpt}</p>
            ) : null}
            <Link
              href={blog.url ?? `/blogs/${blog.slug}`}
              className="read-more"
              aria-label={`Read more: ${blog.title}`}
            >
              Read More <i className="fas fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogPostsGrid;
