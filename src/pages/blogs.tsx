import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import { GetStaticProps } from "next";
// import FormattedDate from "@/components/FormattedDate";
import TitleBanner from "@/components/TitleBanner";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";
import removeMd from "remove-markdown";
import { Blog } from "@/types/blog";

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
      <JsonLdMetaWebsite
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
              {/* {blogs.map((blog) => (
                <div key={blog.slug} className="blog-post-card" data-backgroundurl={blog.featuredImage}>
                  <h3 className="blog-heading">
                    <Link href={`/blogs/${blog.slug}`} aria-label={blog.title}>
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
              ))} */}


              <div className="posts-grid">
                 {blogs.map((blog) => (
                  <article
                    key={blog.slug}
                    className="post-card"
                    style={{
                      animation: "0.8s ease-out 0s 1 normal none running fadeInUp",
                    }}
                  >
                    <div
                      className="post-image"
                      style={{
                        backgroundImage: `
                          linear-gradient(
                            45deg,
                            rgba(44, 82, 130, 0.5),
                            rgba(66, 153, 225, 0.2)
                          ),
                          url(${blog.featuredImage})
                        `,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <i className={blog.featuredImage}></i>
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-category">
                          {blog.category && blog.category[0]}
                        </span>
                        <span>
                          <i className="fas fa-calendar"></i>{" "}
                          {(() => {
                            const dateObj =
                              typeof blog.date === "string"
                                ? new Date(blog.date)
                                : blog.date;
                            return dateObj.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            });
                          })()}
                        </span>
                        {blog.readTime && (
                          <span>
                            <i className="fas fa-clock"></i> {blog.readTime}
                          </span>
                        )}
                      </div>
                      {blog.url ? (
                        <a href={blog.url}>
                          <h3 className="post-title">{blog.title}</h3>
                        </a>
                      ) : (
                        <h3 className="post-title">{blog.title}</h3>
                      )}
                      <p className="post-excerpt">{blog.excerpt}</p>
                      <Link href={blog.url ?? "#"} className="read-more">
                        Read More <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
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
      featuredImage: matterData.data.featuredImage || "",
      url: `/blogs/${filename.slice(0, filename.indexOf("."))}`,
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
