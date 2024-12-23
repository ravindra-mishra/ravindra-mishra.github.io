import React from "react";

const PC: React.FC = () => {
  return (
    <div className="component-section component-content">
      <div className="container">
        <div className="component-title">
          <h2>Publications & Contributions</h2>
        </div>
        <div className="component-content">
          <div className="promo icon-promo-card col-6">
            <div className="icon-image">
              <a
                href="https://blogs.perficient.com/author/rmishra/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="images/prft-icon.png" alt="icon" />
              </a>
            </div>
            <div className="title">
              <h4>Perficient Blogs</h4>
            </div>
            <div className="promo-link-cta button">
              <a
                href="https://blogs.perficient.com/author/rmishra/"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More
              </a>
            </div>
          </div>
          <div className="promo icon-promo-card col-6">
            <div className="icon-image">
              <a
                href="https://dailysitecore.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="images/ds-blog-logo.png" alt="icon" />
              </a>
            </div>
            <div className="title">
              <h4>Daily Sitecore Blogs</h4>
            </div>
            <div className="promo-link-cta button">
              <a
                href="https://dailysitecore.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More
              </a>
            </div>
          </div>
          <div className="promo icon-promo-card col-6">
            <div className="icon-image">
              <a
                href="https://github.com/ravindra-mishra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="images/github-images.jpeg" alt="icon" />
              </a>
            </div>
            <div className="title">
              <h4>GitHub Profile</h4>
            </div>
            <div className="promo-link-cta button">
              <a
                href="https://github.com/ravindra-mishra"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Profile
              </a>
            </div>
          </div>
          <div className="promo icon-promo-card col-6">
            <div className="icon-image">
              <a
                href="https://sitecore.stackexchange.com/users/13057/ravindra-mishra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="images/stack-exchange-sitecore.png" alt="icon" />
              </a>
            </div>
            <div className="title">
              <h4>Sitecore Stack Exchange</h4>
            </div>
            <div className="promo-link-cta button">
              <a
                href="https://sitecore.stackexchange.com/users/13057/ravindra-mishra"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PC;
