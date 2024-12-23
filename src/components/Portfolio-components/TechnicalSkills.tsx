import React from "react";

const TechnicalSkills: React.FC = () => {
    return (
        <div className="component-section component-content">
            <div className="container">
                <div className="component-title">
                    <h2>Technical Skills</h2>
                </div>

                <div className="multi-lists">
                    <div className="multi-lists-section card">
                        <h4>Sitecore</h4>
                        <ul>
                            <li>Sitecore 9.1 & 10.2</li>
                            <li>Sitecore with SXA</li>
                            <li>XM Cloud</li>
                            <li>JSS (Headless)</li>
                            <li>Helix</li>
                        </ul>
                    </div>
                    <div className="multi-lists-section card">
                        <h4>Sitecore Modules</h4>
                        <ul>
                            <li>Sitecore Forms</li>
                            <li>Sitecore Powershell Extensions (SPE)</li>
                            <li>Sitecore Content Serialization</li>
                            <li>Unicorn</li>
                            <li>TDS</li>
                        </ul>
                    </div>
                    <div className="multi-lists-section card">
                        <h4>Search</h4>
                        <ul>
                            <li>Solr Search (SXA Components)</li>
                            <li>Coveo Search</li>
                            <li>Coveo Hive (Coveo with Sitecore)</li>
                            <li>Coveo Admin</li>
                        </ul>
                    </div>
                </div>

                <div className="multi-lists">
                    <div className="multi-lists-section card">
                        <h4>DevOps</h4>
                        <ul>
                            <li>Azure DevOps - Boards</li>
                            <li>Azure DevOps - Build & Release Pipelines</li>
                        </ul>
                    </div>
                    <div className="multi-lists-section card">
                        <h4>Backend</h4>
                        <ul>
                            <li>.NET</li>
                            <li>C#</li>
                            <li>ASP.NET MVC</li>
                            <li>Web API</li>
                            <li>MSSQL Server</li>
                            <li>Git</li>
                        </ul>
                    </div>
                    <div className="multi-lists-section card">
                        <h4>Frontend</h4>
                        <ul>
                            <li>JavaScript</li>
                            <li>jQuery</li>
                            <li>SCSS</li>
                            <li>CSS</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TechnicalSkills;