import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import TitleBanner from "@/components/TitleBanner";
import Breadcrumb from "@/components/Breadcrumb";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";
import Layout from "@/components/Layout";
import Link from "next/link";
import FormattedDate from "@/components/FormattedDate";

import path from "path";
import yaml from "js-yaml";
import { Blog } from "@/types/blog";
import { getAllBlogsSorted } from "@/lib/loadBlogs";

interface Props {
  blogs: Blog[];
  categorySlug: string;
  categoryLabel: string;
}

const CategoryDetailsPage: React.FC<Props> = ({
  blogs,
  categorySlug,
  categoryLabel,
}) => {
  const filteredBlogs = blogs.filter((blog) => {
    if (!blog.category) return false;
    const categories: string[] = Array.isArray(blog.category)
      ? blog.category
      : typeof blog.category === "string"
        ? [blog.category]
        : [];
    return categories.some(
      (cat: string) => cat.toLowerCase() === categorySlug.toLowerCase()
    );
  });

  const canonicalPath = `/categories/${categorySlug}`;

  return (
    <Layout>
      <WebsiteMetaBundle
        path={canonicalPath}
        title={`Blogs in "${categoryLabel}"`}
        description={`Browse all blogs in the "${categoryLabel}" category. Discover articles grouped by this topic and explore related content.`}
      />
      <TitleBanner title={`Blogs in "${categoryLabel}"`} />
      <Breadcrumb />
      <div className="container">
        <div className="">
          <div className="">
            <div className="blog-list">
              {filteredBlogs.length === 0 ? (
                <p>No blogs found for this category.</p>
              ) : (
                filteredBlogs.map((blog) => (
                  <div key={blog.slug} className="blog-post-card">
                    <h3 className="blog-heading">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        aria-label={blog.title}
                      >
                        {blog.title}
                      </Link>
                    </h3>
                    <FormattedDate
                      date={
                        typeof blog.date === "string"
                          ? new Date(blog.date)
                          : blog.date
                      }
                    />
                    <div className="line" />
                    <p className="post-snippet">{blog.excerpt}</p>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="button"
                      aria-label={blog.title}
                      title={blog.title}
                    >
                      Read More
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetailsPage;

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const categorySlug = context.params?.tags as string;
  const tagsPath = path.resolve(process.cwd(), "./content/meta/tags.yml");
  const tagsFile = fs.readFileSync(tagsPath, "utf8");
  const meta = yaml.load(tagsFile) as {
    tags: { name: string; slug: string }[];
  };
  const categoryLabel =
    meta.tags.find((t) => t.slug === categorySlug)?.name ?? categorySlug;

  const blogs = getAllBlogsSorted();

  return {
    props: {
      blogs,
      categorySlug,
      categoryLabel,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tagsPath = path.resolve(process.cwd(), "./content/meta/tags.yml");
  const tagsFile = fs.readFileSync(tagsPath, "utf8");

  const data = yaml.load(tagsFile) as { tags: { name: string; slug: string }[] };
  const paths = data.tags.map((tagObj) => ({
    params: { tags: tagObj.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};
