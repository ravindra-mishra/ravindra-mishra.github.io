import Head from "next/head";
import Navigation from "@/components/Navigation";
import { useEffect, useState, type FC } from "react";
import Link from "next/link";
import config from "@/lib/config";
import ScrollToTop from "@/components/ScrollToTop";
import { GoogleAnalytics } from "@next/third-parties/google";
import SiteFooter from "@/components/SiteFooter";

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  metaDescription?: string;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true); // Tracks header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Tracks the last scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and beyond threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  if (!GA_TRACKING_ID) {
    console.error("NEXT_PUBLIC_GA_TRACKING_ID is not defined");
    return;
  }

  return (
    <div className="">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="favicon/apple-touch-icon.png" />
        <meta name="theme-color" content="#fff" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Head>

      <GoogleAnalytics gaId={GA_TRACKING_ID} />

      <header className={`site-header ${isVisible ? "visible" : "hidden"}`}>
        {/* <div className="container center">
          <div className="header-widget">
            <a className="header-image-wrapper" href="/">
              <img
                alt="Daily Sitecore"
                data-height="170"
                data-width="762"
                src="https://blogger.googleusercontent.com/img/a/AVvXsEi2hMLVuYPwck6n5BdKWMRQ7CEjDBcv6pn2gKC0upv78pcDw7TjI3dcYk3ToTun9TkSqNKMt9uyqyw9rwovBE4Ru30gnLACN8e0C4PKozAvomPVTgO5BvJjqRE_KGgfubPilHaqbWH9XNkOGDcNXdy3YMC7AV9HGzXaiDa2vs9OYs0Hte9IbgzCCHUSlZ4=s762"
              />
            </a>
          </div>
        </div> */}

        <div className="container">
          <div className="header-title">
            <Link href={config.base_url} aria-label="Ravindra Mishra">
              <span className="header-title-name">ravindra</span>
              mishra
            </Link>
          </div>

          <Navigation className="header-nav" />
        </div>
      </header>

      <main className="">{children}</main>

      <SiteFooter />

      <ScrollToTop />
    </div>
  );
};

export default Layout;
