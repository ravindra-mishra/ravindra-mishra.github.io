import Breadcrumb from "@/components/Breadcrumb";
import IntroContent from "@/components/IntroContent";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import TitleBanner from "@/components/TitleBanner";

const Contact = () => {
  return (
    <Layout>
      <BasicMeta
        url={"/contact"}
        title="Contact"
        description="Have a question or want to connect? Visit my contact page to reach out to me directly. Whether you have blog-related inquiries or feedback, I’d love to hear from you!"
      />
      <OpenGraphMeta
        url={"/contact"}
        title="Contact"
        description="Have a question or want to connect? Visit my contact page to reach out to me directly. Whether you have blog-related inquiries or feedback, I’d love to hear from you!"
      />
      <TwitterCardMeta
        url={"/contact"}
        title="Contact"
        description="Have a question or want to connect? Visit my contact page to reach out to me directly. Whether you have blog-related inquiries or feedback, I’d love to hear from you!"
      />
      <TitleBanner title="Contact Me" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid">
          <div className="main-container">
            <p>
              Thank you for visiting my blog site! Whether you have a question,
              feedback you&apos;d like to discuss, I&apos;d love to hear from
              you.
            </p>

            <h2>Get in Touch</h2>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:ravindramishra.cm@gmail.com">
                  📧 ravindramishra.cm@gmail.com
                </a>
              </li>
              <li>
                <strong>GitHub:</strong>{" "}
                <a href="https://github.com/ravindra-mishra" target="_blank">
                  🐙 https://github.com/ravindra-mishra
                </a>
              </li>
              <li>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/mishra-ravindra/"
                  target="_blank"
                >
                  🔗 https://www.linkedin.com/in/mishra-ravindra/
                </a>
              </li>
            </ul>

            <h2>Why Connect with Me?</h2>
            <ul>
              <li>
                <strong>Blog Feedback:</strong> Have suggestions or ideas for my
                blog? I’d love to hear how I can make it better for readers like
                you.
              </li>
              <li>
                <strong>Networking:</strong> Let’s connect to share ideas,
                learn, and grow together in the world of tech and blogging.
              </li>
            </ul>

            <h2>Quick Note</h2>
            <p>
              To ensure a prompt response, please include a clear subject line
              when contacting me via email.
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

export default Contact;
