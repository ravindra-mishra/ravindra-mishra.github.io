import React from "react";

const Experience: React.FC = () => {
  return (
    <div className="promo image-left background-gray">
      <div className="component-title">
        <h2>Work Experience</h2>
      </div>
      <div className="container">
        <div className="promo-image">
          <img src="images/about-us.png" alt="Experience" />
        </div>
        <div className="promo-content">
          <div className="experience">
            {/* First Organization: Perficient India */}
            <div className="organization">
              <div className="timeline">
                <div className="organization-name">
                  <h3>Perficient India Pvt Ltd, Nagpur, India</h3>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="timeline-date">August 2023 to Present</p>
                    <h4>Sr. Technical Consultant</h4>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="timeline-date">August 2021 to July 2023</p>
                    <h4>Technical Consultant</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Organization: PIX Transmissions Ltd */}
            <div className="organization">
              <div className="timeline">
                <div className="organization-name">
                  <h3>PIX Transmissions Ltd, Nagpur, India</h3>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="timeline-date">March 2021 to July 2021</p>
                    <h4>Sr. IT Executive (ASP.Net Developer)</h4>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="timeline-date">December 2019 to March 2021</p>
                    <h4>IT Executive (ASP.Net Developer)</h4>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <p className="timeline-date">October 2018 to October 2019</p>
                    <h4>Trainee Engineer (Intern Developer)</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
