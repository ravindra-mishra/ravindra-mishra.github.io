import Link from "next/link";
import type { FC } from "react";
import type { CategoryWithStats } from "@/lib/categories";

export interface CategoryCardsProps {
  categories: CategoryWithStats[];
}

const CategoryCards: FC<CategoryCardsProps> = ({ categories }) => {
  return (
    <div className="category-cards">
      {categories.map((category) => (
        <article key={category.slug} className="category-card">
          <div className="category-card-top">
            <h2 className="category-card-title">
              <Link href={`/categories/${category.slug}`}>{category.name}</Link>
            </h2>
            <span className="category-card-count">
              {category.postCount}{" "}
              {category.postCount === 1 ? "article" : "articles"}
            </span>
          </div>
          <p className="category-card-desc">{category.description}</p>
          {category.latestTitle && category.latestSlug ? (
            <p className="category-card-latest">
              Latest:{" "}
              <Link href={`/blogs/${category.latestSlug}`}>
                {category.latestTitle}
              </Link>
            </p>
          ) : null}
          <Link
            href={`/categories/${category.slug}`}
            className="category-card-cta"
          >
            Browse {category.name}
            <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
};

export default CategoryCards;
