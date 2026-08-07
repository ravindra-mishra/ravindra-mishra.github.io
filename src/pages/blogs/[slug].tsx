import fs from "fs";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "@/components/Layout";
import removeMd from "remove-markdown";
import Link from "next/link";
import { format } from "date-fns";

import BlogPostMetaBundle from "@/components/meta/BlogPostMetaBundle";
import type { FaqItem, HowToData } from "@/components/meta/JsonLdFaqHowTo";

import "prismjs/themes/prism-tomorrow.css";
import Breadcrumb from "@/components/Breadcrumb";
import readingDuration from "reading-duration";
import BlogHeader from "@/components/BlogHeader";

import CommentBox from "@/components/CommentBox";
import MarkdownLink from "@/components/blog/MarkdownLink";
import CodeBlock from "@/components/blog/CodeBlock";
import MarkdownHeading from "@/components/blog/MarkdownHeading";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import BlogSideTags from "@/components/blog/BlogSideTags";
import { extractTocFromMarkdown } from "@/lib/blogToc";

interface Frontmatter {
  title: string;
  description: string;
  metaDescription: string;
  featuredImage: string;
  keywords: string;
  date: Date;
  modifiedDate?: Date | string;
  tags: { tag: string }[];
  faq?: FaqItem[];
  howto?: HowToData;
  author?: string;
  originalUrl?: string;
  source?: string;
  canonicalUrl?: string;
}

interface BlogFrontmatterResolved
  extends Omit<Frontmatter, "date" | "modifiedDate"> {
  date: string;
  modifiedDate: string;
}

interface BlogProps {
  frontmatter: BlogFrontmatterResolved;
  markdown: string;
  slug: string;
}

const AUTHOR_NAME = "Ravindra Mishra";

const Blog: React.FC<BlogProps> = ({ frontmatter, markdown, slug }) => {
  const postDate = new Date(frontmatter.date);
  const postModified = new Date(frontmatter.modifiedDate);
  const tocItems = extractTocFromMarkdown(markdown);
  const showModified =
    postModified.getTime() !== postDate.getTime() &&
    !Number.isNaN(postModified.getTime());

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const Prism =
          (await import("prismjs")).default || (await import("prismjs"));

        await import("prismjs/components/prism-sql");
        await import("prismjs/components/prism-json");
        await import("prismjs/components/prism-csharp");
        await import("prismjs/components/prism-powershell");
        Prism.highlightAll();
      })();
    }
  }, [markdown]);

  const readingTime = readingDuration(markdown, {
    wordsPerMinute: 150,
    emoji: true,
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
        author={frontmatter.author || AUTHOR_NAME}
        canonicalUrl={frontmatter.canonicalUrl}
        articlePlainText={articlePlainText}
        tags={frontmatter.tags}
        faq={frontmatter.faq}
        howto={frontmatter.howto}
      />

      <article className="blog-post-page" aria-labelledby="blog-post-title">
        <BlogHeader
          title={frontmatter.title}
          date={postDate}
          className="blog-page"
          readingTime={readingTime}
          featureImage={frontmatter.featuredImage}
          source={frontmatter.source}
          originalUrl={frontmatter.originalUrl}
        />
        <Breadcrumb className="blog-page" />
        <div className="container">
          <div className="container-fluid blog-body-layout">
            <div className="blog-container">
              <hr className="blog-rule blog-rule-start" />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: MarkdownLink,
                  pre: ({ children, className }) => (
                    <CodeBlock className={className}>{children}</CodeBlock>
                  ),
                  h2: ({ children }) => (
                    <MarkdownHeading level={2}>{children}</MarkdownHeading>
                  ),
                  h3: ({ children }) => (
                    <MarkdownHeading level={3}>{children}</MarkdownHeading>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
              <hr className="blog-rule blog-rule-end" />
              <p className="blog-authored-by">
                Authored by{" "}
                <Link href="/about">{frontmatter.author || AUTHOR_NAME}</Link>{" "}
                on {format(postDate, "MMMM d, yyyy")}
                {showModified ? (
                  <>
                    {" "}
                    · Modified on {format(postModified, "MMMM d, yyyy")}
                  </>
                ) : null}
              </p>
              <CommentBox />
            </div>
            <aside className="blog-side-container" aria-label="Page navigation">
              <BlogTableOfContents items={tocItems} />
              <BlogSideTags tags={frontmatter.tags} />
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
