import React from "react";

const PromoSection: React.FC = () => {
  return (
    <div className="promo image-right background-primary">
      <div className="container">
        <div className="promo-content">
          <div className="eyebrow">Hello folks!</div>
          <div className="title">
            <h1>I am Ravindra Mishra</h1>
          </div>
          <div className="description">
            Senior Sitecore Developer & Full Stack Web Developer
            <br />
            <br />
            Having over 7 years of experience in development, specializing in
            Sitecore and ASP.NET applications, I have a strong background in
            creating scalable and efficient solutions.
            <br />
            <br />
            My expertise includes Sitecore SXA, JSS, C#, and .NET, with a keen
            interest in frontend technologies like JavaScript, jQuery, and SCSS.
          </div>
          <div className="button button-primary-alternate">
            <a
              href="https://www.linkedin.com/in/mishra-ravindra/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Profile
            </a>
          </div>
        </div>
        <div className="promo-image">
          <img src="images/home-right.png" alt="Hi, I am Ravindra!" />
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
