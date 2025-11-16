import Breadcrumb from "@/components/Breadcrumb";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import TitleBanner from "@/components/TitleBanner";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const currentYear = new Date().getFullYear();

    const overallExperienceElement =
      document.getElementById("overall-experience");
    const sitecoreExperienceElement = document.getElementById(
      "sitecore-experience"
    );

    if (overallExperienceElement) {
      overallExperienceElement.textContent = (currentYear - 2018).toString();
    }

    if (sitecoreExperienceElement) {
      sitecoreExperienceElement.textContent = (currentYear - 2021).toString();
    }
  }, []);

  return (
    <Layout>
      <BasicMeta url={"/about"} title="About" />
      <OpenGraphMeta url={"/about"} title="About" />
      <TwitterCardMeta url={"/about"} title="About" />
      <JsonLdMetaWebsite url={"/about"} title="About" />
      <TitleBanner title="About" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid">
          <div className="main-container">
            <p>
              Hi,
              <br />
              My name is Ravindra Mishra. I have over{" "}
              <span id="overall-experience">5</span> years of experience in
              ASP.NET development and <span id="sitecore-experience">3</span>{" "}
              years in Sitecore. Currently, I work as a Senior Technical
              Consultant at an IT firm, where I specialize in Sitecore
              development and maintenance projects.
            </p>
            <p>
              This is my personal blog, created to share my Sitecore learning
              journey, experiences, and the challenges I’ve encountered during
              Sitecore projects. I aim to provide insights that can help
              developers navigate similar scenarios.
            </p>
            <p>
              This blog is intended for learning purposes. Developers are
              encouraged to use it as a reference and follow best practices in
              their own projects.
            </p>
            <p>
              For any queries or questions, feel free to connect with me on{" "}
              <a
                href="https://in.linkedin.com/in/mishra-ravindra"
                target="_blank"
              >
                LinkedIn
              </a>
              .
            </p>
            <p>Happy learning!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
