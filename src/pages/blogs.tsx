import Link from "next/link";
import Layout from "@/components/Layout";
import { GetStaticProps } from "next";
import TitleBanner from "@/components/TitleBanner";
import Breadcrumb from "@/components/Breadcrumb";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";
import BlogPostsGrid from "@/components/blog/BlogPostsGrid";
import { getAllBlogsSorted } from "@/lib/loadBlogs";
import { Blog } from "@/types/blog";

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
        <div className="blog-list">
          <p className="category-hub-lead">
            Practical Sitecore, XM Cloud, Marketplace, and .NET tutorials—newest
            first. Prefer topic browsing?{" "}
            <Link href="/categories">Explore categories</Link>.
          </p>
          <BlogPostsGrid blogs={blogs} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => ({
  props: {
    blogs: getAllBlogsSorted(),
  },
});
