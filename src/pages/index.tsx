import Layout from "@/components/Layout";
import Banner from "@/components/Portfolio-components/Banner";
import TechnicalSkills from "@/components/Portfolio-components/TechnicalSkills";
// import Experience from "@/components/Portfolio-components/Experience";
import PC from "@/components/Portfolio-components/PC";
import Award from "@/components/Portfolio-components/Award";
// import Projects from "@/components/Portfolio-components/Projects";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";
import { GetStaticProps } from "next";
import LatestBlogs from "@/components/Sections/LatestBlogs";
import { getAllBlogsSorted } from "@/lib/loadBlogs";
import type { Blog } from "@/types/blog";

type PortfolioProps = {
  blogs: Blog[];
};

const Portfolio = ({ blogs }: PortfolioProps) => {
  return (
    <Layout>
      <WebsiteMetaBundle
        path="/"
        title="Sitecore & .NET Developer Blog"
      />

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

export const getStaticProps: GetStaticProps<PortfolioProps> = async () => ({
  props: {
    blogs: getAllBlogsSorted(),
  },
});
