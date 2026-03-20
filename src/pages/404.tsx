import Breadcrumb from "@/components/Breadcrumb";
import Layout from "@/components/Layout";
import BasicMeta from "@/components/meta/BasicMeta";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import TitleBanner from "@/components/TitleBanner";
import Link from "next/link";

const Page404 = () => {
  return (
    <Layout>
      <BasicMeta
        url={"/404"}
        title="Error 404 - Page Not Found"
        robots="noindex, follow"
      />
      <OpenGraphMeta url={"/404"} />
      <TwitterCardMeta url={"/404"} />
      <TitleBanner title="Error 404 - Page Not Found" />
      <Breadcrumb />
      <div className="container">
        <div className="container-fluid">
          <div className="main-container">
            <h1>Oops! Page Not Found</h1>
            <p>
              It looks like the page you were trying to reach doesn&apos;t exist
              or has been moved.
            </p>
            <p>Here are some things you can do:</p>
            <ul>
              <li>Double-check the URL for typos.</li>
              <li>
                <Link href="/" aria-label="Home Page">
                  Return to our homepage
                </Link>
                .
              </li>
              <li>
                <Link href="/sitemap.xml" aria-label="Sitemap">
                  Explore our site map
                </Link>
                .
              </li>
            </ul>
            <p>
              If you think this is an error, feel free to{" "}
              <Link href="/contact" aria-label="Contact">
                contact us
              </Link>
              .
            </p>
            <p>Helpful Links:</p>
            <ul>
              <li>
                <Link href="javascript:history.back()" aria-label="Go Back!">
                  Go Back
                </Link>
              </li>
              <li>
                <Link href="/contact" aria-label="Contact">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="side-container"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Page404;
