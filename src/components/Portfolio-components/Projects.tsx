import React from "react";
const Projects: React.FC = () => {
  return (
    <div className="component-section component-content">
      <div className="container">
        <div className="component-title">
          <h2>Recent Projects</h2>
        </div>
        <div className="project-list">
          <div className="project-card background-white">
            <div className="project-title">
              <h3>Microsite for an Energy and Product-Based Company</h3>
            </div>
            <div className="duration">2 Months</div>
            <div className="description">
              Sitecore XM Cloud, Sitecore Search, JSS (Headless), full-stack
              development.
            </div>
          </div>
          <div className="project-card background-white">
            <div className="project-title">
              <h3>Tiles Manufacturing Company</h3>
            </div>
            <div className="duration">2 years +</div>
            <div className="description">
              Sitecore 10.2, Coveo Search Enhancement, Sitecore Upgrade,
              Automated CI/CD processes, full stack development.
            </div>
          </div>
          <div className="project-card background-white">
            <div className="project-title">
              <h3>Healthcare Company</h3>
            </div>
            <div className="duration">6 Months</div>
            <div className="description">
              Sitecore 10.2, customize SXA rendering, Solr Index configuration,
              SXA Search Components.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Projects;
