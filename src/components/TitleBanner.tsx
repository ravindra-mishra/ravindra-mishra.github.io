import type { FC } from "react";

export interface TitleBannerProps {
  className?: string;
  title: string;
}

const TitleBanner: FC<TitleBannerProps> = ({ className, title }) => {
  return (
    <div className={`background-primary title-banner ${className || ""}`}>
      <div className="container">
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default TitleBanner;
