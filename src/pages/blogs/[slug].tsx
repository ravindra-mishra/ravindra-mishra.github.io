import fs from "fs";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "@/components/Layout";
import removeMd from "remove-markdown";

import IntroContent from "@/components/IntroContent";
import BlogPostMetaBundle from "@/components/meta/BlogPostMetaBundle";
import type { FaqItem, HowToData } from "@/components/meta/JsonLdFaqHowTo";

import "prismjs/themes/prism-tomorrow.css"; // Syntax highlighting theme
import Breadcrumb from "@/components/Breadcrumb";
import readingDuration from "reading-duration";
import BlogHeader from "@/components/BlogHeader";
import TagList from "@/components/TagList";

import CommentBox from "@/components/CommentBox";
import MarkdownLink from "@/components/blog/MarkdownLink";

// Frontmatter type definition
interface Frontmatter {
  title: string;
  description: string;
  metaDescription: string;
  featuredImage: string;
  keywords: string;
  date: Date;
  /** Optional; defaults to `date` when building the page. */
  modifiedDate?: Date | string;
  tags: { tag: string }[];
  faq?: FaqItem[];
  howto?: HowToData;
}

/** Dates as ISO strings — JSON-serializable for `getStaticProps`. */
interface BlogFrontmatterResolved extends Omit<Frontmatter, "date" | "modifiedDate"> {
  date: string;
  modifiedDate: string;
}

// Props type definition
interface BlogProps {
  frontmatter: BlogFrontmatterResolved;
  markdown: string;
  slug: string;
}

const Blog: React.FC<BlogProps> = ({ frontmatter, markdown, slug }) => {
  const postDate = new Date(frontmatter.date);
  const postModified = new Date(frontmatter.modifiedDate);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const Prism =
          (await import("prismjs")).default || (await import("prismjs"));

        await import("prismjs/components/prism-sql");
        await import("prismjs/components/prism-json");
        await import("prismjs/components/prism-csharp");
        Prism.highlightAll();
      })();
    }
  }, []);

  const readingTime = readingDuration(markdown, {
    wordsPerMinute: 150,
    emoji: "open_book",
  });

  const articlePlainText = removeMd(markdown);

  return (
    <Layout>
      <BlogPostMetaBundle
        slug={slug}
        title={frontmatter.title}
        description={frontmatter.description}
        metaDescription={frontmatter.metaDescription}
        featuredImage={frontmatter.featuredImage}
        keywords={frontmatter.keywords}
        date={postDate}
        modifiedDate={postModified}
        articlePlainText={articlePlainText}
        tags={frontmatter.tags}
        faq={frontmatter.faq}
        howto={frontmatter.howto}
      />

      <article className="blog-post-page" aria-labelledby="blog-post-title">
        <BlogHeader
          title={frontmatter.title}
          date={postDate}
          tags={frontmatter.tags}
          className="blog-page"
          readingTime={readingTime}
          featureImage={frontmatter.featuredImage}
        />
        <Breadcrumb className="blog-page" />
        <div className="container">
          <div className="container-fluid">
            <div className="blog-container">
              <hr />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: MarkdownLink,
                }}
              >
                {markdown}
              </ReactMarkdown>
              <hr />
              <CommentBox />
            </div>
            <aside className="blog-side-container">
              <TagList
                tags={frontmatter.tags}
                emoji={false}
                title="Tags: "
                className="card-box"
              />
              <IntroContent />
            </aside>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Blog;

function coerceBlogDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

// Fetch data for the blog page
export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const fileContent = matter(
    fs.readFileSync(`./content/blogs/${slug}.md`, "utf8")
  );
  const raw = fileContent.data as Frontmatter;
  const date = coerceBlogDate(raw.date);
  const modifiedDate =
    raw.modifiedDate != null ? coerceBlogDate(raw.modifiedDate) : date;

  return {
    props: {
      frontmatter: {
        ...raw,
        date: date.toISOString(),
        modifiedDate: modifiedDate.toISOString(),
      },
      markdown: fileContent.content,
      slug,
    },
  };
};

// Generate paths for static generation
export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync("./content/blogs");
  const paths = files.map((file) => ({
    params: { slug: file.replace(/\.md$/, "") },
  }));

  return {
    paths,
    fallback: false,
  };
};
