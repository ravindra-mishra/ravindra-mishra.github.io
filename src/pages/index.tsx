import Layout from "@/components/Layout";
import Banner from "@/components/Portfolio-components/Banner";
import TechnicalSkills from "@/components/Portfolio-components/TechnicalSkills";
// import Experience from "@/components/Portfolio-components/Experience";
import PC from "@/components/Portfolio-components/PC";
import Award from "@/components/Portfolio-components/Award";
// import Projects from "@/components/Portfolio-components/Projects";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";
import { GetStaticProps } from "next";
import fs from "fs";
import matter from "gray-matter";
import removeMd from "remove-markdown";
import LatestBlogs from "@/components/Sections/LatestBlogs";

type Blog = {
  title: string;
  date: string | Date;
  content: string;
  slug: string;
};

type PortfolioProps = {
  blogs: Blog[];
};

const Portfolio = ({ blogs }: PortfolioProps) => {
  return (
    <Layout>
      <BasicMeta url={"/"} title="Sitecore & .NET Developer Blog" />
      <OpenGraphMeta url={"/"} title="Sitecore & .NET Developer Blog" />
      <TwitterCardMeta url={"/"} title="Sitecore & .NET Developer Blog" />
      <JsonLdMetaWebsite url={"/"} title="Sitecore & .NET Developer Blog" />
      
      <LatestBlogs blogs={blogs} />
      <Banner />
      <PC />
      <Award />
      {/* <Experience /> */}
      <TechnicalSkills />
  
      {/* <Projects /> */}
    </Layout>
  );
};

export default Portfolio;

export const getStaticProps: GetStaticProps = async () => {
  // List of files in the blogs folder
  const filesInBlogs = fs.readdirSync("./content/blogs");

  // Get the front matter and slug (the filename without .md) of all files
  const blogs: Blog[] = filesInBlogs.map((filename) => {
    const file = fs.readFileSync(`./content/blogs/${filename}`, "utf8");
    const matterData = matter(file);
    const plainTextContent = removeMd(matterData.content as string);

    // Calculate read time (simple words-per-minute estimate)
    const words = plainTextContent.split(/\s+/).length;
    const readTime = Math.ceil(words / 200) + " min read";

    return {
      title: matterData.data.title as string,
      excerpt:
        matterData.data.excerpt ||
        plainTextContent.slice(0, 150) +
          (plainTextContent.length > 150 ? "..." : ""),
      category:
        Array.isArray(matterData.data.tags) && matterData.data.tags.length > 0
          ? matterData.data.tags.map((tag: string | { tag: string }) =>
              typeof tag === "object" && tag !== null ? tag.tag : tag
            )
          : undefined,
      date: matterData.data.date as string | Date,
      readTime,
      iconClass: "",
      url: `/blogs/${filename.slice(0, filename.indexOf("."))}`,
      featuredImage: matterData.data.featuredImage || "",
      featured: matterData.data.featured || false,
      content: plainTextContent,
      slug: filename.slice(0, filename.indexOf(".")),
    };
  });

  blogs.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return {
    props: {
      blogs,
    },
  };
};
