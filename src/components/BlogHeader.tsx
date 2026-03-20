import type { FC } from "react";
import FormattedDate from "@/components/FormattedDate";
// import TagList from "./TagList";

export interface BlogHeaderProps {
  className?: string;
  title: string;
  tags?: { tag: string }[];
  date: Date;
  readingTime: string;
  featureImage: string;
}

const BlogHeader: FC<BlogHeaderProps> = ({
  className,
  title,
  date,
  readingTime,
  featureImage
}) => {
  return (
     <div
        className={`background-primary blog-header ${className || ""}`}
        style={{
          backgroundImage: `linear-gradient(45deg, #2c5282, #2c5282a8), url(${featureImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
      <div className="container" data-backgroundurl={featureImage}>
        <h1 id="blog-post-title">{title}</h1>
        <div className="blog-header-summary">
          <FormattedDate date={date} emoji={true} />
          <div>{readingTime}</div>
          {/* <TagList tags={tags} emoji={true} className="inline" /> */}
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
