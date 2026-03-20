import Breadcrumb from "@/components/Breadcrumb";
import IntroContent from "@/components/IntroContent";
import Layout from "@/components/Layout";
import WebsiteMetaBundle from "@/components/meta/WebsiteMetaBundle";
import TitleBanner from "@/components/TitleBanner";

const Privacy = () => {
  return (
    <Layout>
      <WebsiteMetaBundle
        path="/privacy"
        title="Privacy Policy"
        description="Your privacy matters to me. Read my privacy policy to understand how I handle your data when you visit my website and interact with my blog. Learn about the steps I take to protect your privacy."
      />
      <TitleBanner title="Privacy Policy" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid">
          <div className="main-container">
            <p>
              <strong>Effective Date:</strong> November 16, 2025
            </p>
            <p>
              <strong>Last Updated:</strong> November 16, 2025
            </p>
            <p>
              This Privacy Policy explains how your information is collected,
              used, and protected when you visit{" "}
              <a href="https://ravindra-mishra.github.io/">
                https://ravindra-mishra.github.io
              </a>{" "}
              (the &quot;Website&quot;), operated by Ravindra Mishra, an individual based
              in India.
            </p>

            <h2>1. Information Collected</h2>
            <p>
              <strong>Personal Information:</strong> You may voluntarily provide
              your information (such as your name or contact details) when
              reaching out via LinkedIn, or through other direct communication
              channels.
            </p>
            <p>
              <strong>Non-Personal Information:</strong> Technical details like
              your browser type, device, IP address, and page visits may be
              collected, primarily through analytics tools such as Google
              Analytics.
            </p>

            <h2>2. Use of Information</h2>
            <p>Your information is used for:</p>
            <ul>
              <li>Responding to inquiries made via LinkedIn</li>
              <li>Improving Website functionality and content</li>
              <li>Anonymous analytics and performance tracking</li>
              <li>Ensuring Website security and stability</li>
            </ul>

            <h2>3. Data Storage and Retention</h2>
            <p>
              Personal and non-personal data may be stored either locally or
              through third-party services, depending on how you contact or
              interact with the Website (e.g., LinkedIn, analytics platforms).
              Data is retained only as long as necessary for communication, site
              improvement, or legal obligations.
            </p>

            <h2>4. Legal Basis</h2>
            <p>
              The Website complies with major regulations, including the EU
              General Data Protection Regulation (GDPR), California Consumer
              Privacy Act (CCPA), and India&apos;s Digital Personal Data Protection
              Act, 2023 (DPDP Act). Data is processed based on your consent,
              legitimate interests, or legal requirements, as applicable.
            </p>

            <h2>5. Cookies and Tracking</h2>
            <p>
              The Website may use cookies to enhance your experience and support
              anonymous analytics via Google Analytics. You can manage cookie
              preferences through your browser settings. No active cookie
              consent banner is currently displayed, but this may change for
              future legal compliance.
            </p>

            <h2>6. Third-Party Services</h2>
            <ul>
              <li>
                Google Analytics: Used for site performance and visitor
                analytics.
              </li>
              <li>GitHub Pages: Website hosting.</li>
              <li>Netlify: Used for site authoring and previewing.</li>
              <li>LinkedIn: Used as the primary contact channel.</li>
            </ul>

            <h2>7. Data Protection and Security</h2>
            <p>
              Reasonable administrative and technical safeguards are in place,
              but no transmission over the Internet can be guaranteed as
              entirely secure.
            </p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul>
              <li>Request access to your data</li>
              <li>Correct, delete, or limit the processing of your data</li>
              <li>
                Withdraw consent at any time (where processing is based on
                consent)
              </li>
            </ul>
            <p>To exercise these rights, please contact via LinkedIn.</p>

            <h2>9. International Users</h2>
            <p>
              International visitors’ data may be processed in India. By using
              this Website, you consent to such processing.
            </p>

            <h2>10. Policy Updates</h2>
            <p>
              This policy may be updated periodically. The latest version will
              always be posted on this page.
            </p>

            <h2>11. Disclaimer: Personal Views and Professional Advice</h2>
            <p>
              All information, content, and opinions shared via this Website are
              solely the personal views of Ravindra Mishra and do not
              necessarily reflect those of any employer, organization, or
              affiliated group. The materials provided are intended for
              informational purposes only; viewers are strongly advised to refer
              to official sources and recommended industry practices before
              using, implementing, or relying upon any information found herein.
            </p>
            <p>
              No professional, legal, or other relationship is formed by
              visiting or interacting with the Website. The Website owner
              disclaims liability for any consequences arising from your use of
              the content, and recommends seeking expert or official guidance
              whenever appropriate.
            </p>

            <h2>12. Contact</h2>
            <p>
              For privacy-related questions or requests, please reach out via
              LinkedIn:
              <br />
              <strong>Name:</strong> Ravindra Mishra
              <br />
              <strong>Location:</strong> Nagpur, Maharashtra, India
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
