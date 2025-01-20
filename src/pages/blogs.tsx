import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import { GetStaticProps } from "next";
import FormattedDate from "@/components/FormattedDate";
import TitleBanner from "@/components/TitleBanner";
import Breadcrumb from "@/components/Breadcrumb";

// Define the type for a single blog item
interface Blog {
  title: string;
  content: string;
  date: Date;
  slug: string; // The filename without the .md extension
}

// Define the props for the Home component
interface HomeProps {
  blogs: Blog[];
}

const Home: React.FC<HomeProps> = ({ blogs }) => {
  return (
    <Layout>
      <BasicMeta
        url={"/blogs"}
        title="Latest Blog Articles"
        description="Sitecore CMS. A technical blog about sitecore learning for sitecore developer. Technologies like Sitecore, SXA, Headless, XM Cloud."
      />
      <OpenGraphMeta
        url={"/blogs"}
        title="Latest Blog Articles"
        description="Sitecore CMS. A technical blog about sitecore learning for sitecore developer. Technologies like Sitecore, SXA, Headless, XM Cloud."
      />
      <TwitterCardMeta
        url={"/blogs"}
        title="Latest Blog Articles"
        description="Sitecore CMS. A technical blog about sitecore learning for sitecore developer. Technologies like Sitecore, SXA, Headless, XM Cloud."
      />
      <TitleBanner title="Latest Blog Articles" />
      <Breadcrumb />

      <div className="container">
        <div className="">
          <div className="">
            <div className="blog-list">
              {blogs.map((blog) => (
                <div key={blog.slug} className="blog-post-card">
                  <h3 className="blog-heading">
                    <Link href={`/blogs/${blog.slug}`} aria-label={blog.title}>
                      {blog.title}
                    </Link>
                  </h3>
                  <FormattedDate date={blog.date} />
                  <div className="line" />
                  <p className="post-snippet">{blog.content}</p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="button"
                    aria-label={blog.title}
                    title={blog.title}
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

// Type for getStaticProps
export const getStaticProps: GetStaticProps = async () => {
  // List of files in the blogs folder
  const filesInBlogs = fs.readdirSync("./content/blogs");

  // Get the front matter and slug (the filename without .md) of all files
  const blogs: Blog[] = filesInBlogs.map((filename) => {
    const file = fs.readFileSync(`./content/blogs/${filename}`, "utf8");
    const matterData = matter(file);

    return {
      title: matterData.data.title as string,
      date: matterData.data.date as Date,
      content:
        (matterData.content as string).slice(0, 150) +
        (matterData.content.length > 150 ? "..." : ""),
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
