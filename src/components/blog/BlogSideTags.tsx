"use client";

import Link from "next/link";
import type { FC } from "react";

export interface BlogSideTagsProps {
  tags: { tag: string }[];
}

/** Sidebar tags — matches On this page TOC visual language */
const BlogSideTags: FC<BlogSideTagsProps> = ({ tags }) => {
  if (!tags?.length) return null;

  return (
    <nav className="blog-toc blog-side-tags" aria-label="Tags">
      <p className="blog-toc-title">Tags</p>
      <ol>
        {tags.map((tagObj) => (
          <li key={tagObj.tag} className="level-2">
            <Link href={`/categories/${tagObj.tag}`}>#{tagObj.tag}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BlogSideTags;
