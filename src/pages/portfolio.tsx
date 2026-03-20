import Layout from "@/components/Layout";
import Banner from "@/components/Portfolio-components/Banner";
import TechnicalSkills from "@/components/Portfolio-components/TechnicalSkills";
import Experience from "@/components/Portfolio-components/Experience";
import PC from "@/components/Portfolio-components/PC";
import Award from "@/components/Portfolio-components/Award";
import Projects from "@/components/Portfolio-components/Projects";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";

const Portfolio = () => {
  return (
    <Layout>
      <BasicMeta url={"/portfolio"} title="Portfolio" />
      <OpenGraphMeta url={"/portfolio"} title="Portfolio" />
      <TwitterCardMeta url={"/portfolio"} title="Portfolio" />
      <JsonLdMetaWebsite url={"/portfolio"} title="Portfolio" />
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
