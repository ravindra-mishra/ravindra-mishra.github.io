import type { FC } from "react";

export interface IntroContentProps {
  className?: string;
}

const IntroContent: FC<IntroContentProps> = ({ className }) => {
  return (
    <div className={`intro-content ${className || ""}`}>
      <h4 className="intro-title">About Me</h4>
      <div className="hero-author-photo">
        <img
          src="https://avatars.githubusercontent.com/u/56933773"
          alt="Profile Picture - Ravindra Mishra"
        />
      </div>
      <p className="intro-snippet">
        My name is Ravindra Mishra. I am a Sitecore Consultant with over 5 years
        of experience as an IT professional, including 3 years of specialized
        experience with Sitecore. I love traveling, exploring new places, and
        capturing natural photos with my mobile phone.
      </p>
      <div className="intro-action">
        <a
          href="https://in.linkedin.com/in/mishra-ravindra/"
          className="button button-primary"
        >
          Visit Profile
        </a>
      </div>
    </div>
  );
};

export default IntroContent;
