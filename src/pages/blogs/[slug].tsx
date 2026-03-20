import fs from "fs";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "@/components/Layout";
import removeMd from "remove-markdown";

import IntroContent from "@/components/IntroContent";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";

import "prismjs/themes/prism-tomorrow.css"; // Syntax highlighting theme
import Breadcrumb from "@/components/Breadcrumb";
import readingDuration from "reading-duration";
import BlogHeader from "@/components/BlogHeader";
import TagList from "@/components/TagList";

import CommentBox from "@/components/CommentBox";
import JsonLdMetaBlog from "@/components/meta/JsonLdMetaBlog";

// Frontmatter type definition
interface Frontmatter {
  title: string;
  description: string;
  metaDescription: string;
  featuredImage: string;
  keywords: string;
  date: Date;
  tags: { tag: string }[];
}

// Props type definition
interface BlogProps {
  frontmatter: Frontmatter;
  markdown: string;
  slug: string;
}

const Blog: React.FC<BlogProps> = ({ frontmatter, markdown, slug }) => {
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

  return (
    <Layout>
      {/* SEO Meta Tags */}
      <BasicMeta
        url={`/blogs/${slug}`}
        title={frontmatter.title}
        description={frontmatter.description}
        keywords={[frontmatter.keywords]}
        author="Ravindra Mishra"
      />
      <OpenGraphMeta
        url={`/blogs/${slug}`}
        title={frontmatter.title}
        description={frontmatter.metaDescription}
        image={frontmatter.featuredImage}
        ogType="article"
      />
      <TwitterCardMeta
        url={`/blogs/${slug}`}
        title={frontmatter.title}
        description={frontmatter.metaDescription}
      />

      <JsonLdMetaBlog
        url={`/blogs/${slug}`}
        title={frontmatter.title}
        description={frontmatter.metaDescription}
        date={frontmatter.date}
        modifiedDate={frontmatter.date}
        content={removeMd(markdown)}
        author="Ravindra Mishra"
        image={frontmatter.featuredImage}
      />

      <BlogHeader
        title={frontmatter.title}
        date={frontmatter.date}
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
            <ReactMarkdown>{markdown}</ReactMarkdown>
            <hr />
            <CommentBox />
          </div>
          <div className="blog-side-container">
            <TagList
              tags={frontmatter.tags}
              emoji={false}
              title="Tags: "
              className="card-box"
            />
            <IntroContent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;

// Fetch data for the blog page
export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const fileContent = matter(
    fs.readFileSync(`./content/blogs/${slug}.md`, "utf8")
  );

  return {
    props: {
      frontmatter: fileContent.data as Frontmatter,
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
