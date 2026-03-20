import Link from "next/link";
import Layout from "@/components/Layout";
import { GetStaticProps } from "next";
import TitleBanner from "@/components/TitleBanner";
import Breadcrumb from "@/components/Breadcrumb";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";
import { getAllBlogsSorted } from "@/lib/loadBlogs";
import { Blog } from "@/types/blog";

// Define the props for the Home component
interface HomeProps {
  blogs: Blog[];
}

const BLOG_INDEX_DESCRIPTION =
  "Sitecore CMS. A technical blog about sitecore learning for sitecore developer. Technologies like Sitecore, SXA, Headless, XM Cloud.";

const Home: React.FC<HomeProps> = ({ blogs }) => {
  return (
    <Layout>
      <WebsiteMetaBundle
        path="/blogs"
        title="Latest Blog Articles"
        description={BLOG_INDEX_DESCRIPTION}
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
                        <Link href={blog.url}>
                          <h3 className="post-title">{blog.title}</h3>
                        </Link>
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
export const getStaticProps: GetStaticProps<HomeProps> = async () => ({
  props: {
    blogs: getAllBlogsSorted(),
  },
});
