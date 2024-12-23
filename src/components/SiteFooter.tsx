import { FC } from "react";
import config from "@/lib/config";
import Navigation from "./Navigation";

const SiteFooter: FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top-section">
          <div className="footer-logo-section">
            <div>
              <div className="header-title dark">
                <a href={config.base_url}>
                  <span className="header-title-name">ravindra</span>
                  mishra
                </a>
              </div>
            </div>
          </div>
          <div className="footer-links-section">
            <div>
              <Navigation isFooter={true} />
            </div>
          </div>
        </div>

        <div className="footer-bottom-section">
          <div className="footer-copyright">
            <p>© 2025 Ravindra Mishra. All rights reserved</p>
          </div>
          <div className="footer-credit"></div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
