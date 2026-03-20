import Layout from "@/components/Layout";
import Banner from "@/components/Portfolio-components/Banner";
import TechnicalSkills from "@/components/Portfolio-components/TechnicalSkills";
import Experience from "@/components/Portfolio-components/Experience";
import PC from "@/components/Portfolio-components/PC";
import Award from "@/components/Portfolio-components/Award";
import Projects from "@/components/Portfolio-components/Projects";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";

const Portfolio = () => {
  return (
    <Layout>
      <WebsiteMetaBundle path="/portfolio" title="Portfolio" />
      <Banner />
      <TechnicalSkills />
      <Experience />
      <PC />
      <Award />
      <Projects />
    </Layout>
  );
};

export default Portfolio;
