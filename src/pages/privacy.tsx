import Breadcrumb from "@/components/Breadcrumb";
import IntroContent from "@/components/IntroContent";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import TitleBanner from "@/components/TitleBanner";

const Privacy = () => {
  return (
    <Layout>
      <BasicMeta
        url={"/privacy"}
        title="Privacy Policy"
        description="Your privacy matters to me. Read my privacy policy to understand how I handle your data when you visit my website and interact with my blog. Learn about the steps I take to protect your privacy."
      />
      <OpenGraphMeta
        url={"/privacy"}
        title="Privacy Policy"
        description="Your privacy matters to me. Read my privacy policy to understand how I handle your data when you visit my website and interact with my blog. Learn about the steps I take to protect your privacy."
      />
      <TwitterCardMeta
        url={"/privacy"}
        title="Privacy Policy"
        description="Your privacy matters to me. Read my privacy policy to understand how I handle your data when you visit my website and interact with my blog. Learn about the steps I take to protect your privacy."
      />
      <JsonLdMetaWebsite
        url={"/privacy"}
        title="Privacy Policy"
        description="Your privacy matters to me. Read my privacy policy to understand how I handle your data when you visit my website and interact with my blog. Learn about the steps I take to protect your privacy."
      />
      <TitleBanner title="Privacy Policy" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid">
          <div className="main-container">
            <p>
              This blog respects your privacy and does not share personal data
              with third parties. We do not store any information about your
              visit to this blog, except the following:
            </p>
            <ul>
              <li>
                <strong>Comments:</strong> Commenting functionality is provided
                through a third-party service, which may require login to post
                comments.
              </li>
              <li>
                <strong>Analytics:</strong> We use Google Analytics to track
                page visits and analyze content performance.
              </li>
            </ul>
            <p>
              Cookies are used solely to optimize your reading experience. You
              can disable cookies at any time by adjusting your browser
              settings.
            </p>
            <p>
              This Privacy Policy is subject to change without notice and was
              last updated on December 23, 2024.
            </p>
            <p>
              If you have any questions, feel free to{" "}
              <a href="mailto:ravindramishra.cm@gmail.com">contact me</a>.
            </p>
          </div>

          <div className="side-container">
            <IntroContent className="remove-top-margin" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
