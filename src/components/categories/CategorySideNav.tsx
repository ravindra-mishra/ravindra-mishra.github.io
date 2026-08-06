import Link from "next/link";
import type { FC } from "react";
import type { CategoryMeta } from "@/lib/categories";

export interface CategorySideNavProps {
  categories: CategoryMeta[];
  activeSlug?: string;
  title?: string;
}

/** Sidebar category list — matches On this page / Tags rail style */
const CategorySideNav: FC<CategorySideNavProps> = ({
  categories,
  activeSlug,
  title = "All categories",
}) => {
  if (!categories.length) return null;

  return (
    <nav className="blog-toc category-side-nav" aria-label={title}>
      <p className="blog-toc-title">{title}</p>
      <ol>
        {categories.map((cat) => (
          <li key={cat.slug} className="level-2">
            <Link
              href={`/categories/${cat.slug}`}
              className={
                activeSlug?.toLowerCase() === cat.slug.toLowerCase()
                  ? "is-active"
                  : undefined
              }
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ol>
      <Link href="/categories" className="category-side-all">
        View all categories
      </Link>
    </nav>
  );
};

export default CategorySideNav;
