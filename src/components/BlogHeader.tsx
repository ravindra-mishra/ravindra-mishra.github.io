import type { FC } from "react";
import FormattedDate from "@/components/FormattedDate";
import TagList from "./TagList";

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
  tags,
  date,
  readingTime,
  featureImage,
}) => {
  return (
    <div className={`background-primary blog-header ${className || ""}`}>
      <img
        className="blog-header-image"
        src={featureImage}
        alt={title}
        width={1200}
        height={630}
        decoding="async"
        fetchPriority="high"
      />
      <div className="blog-header-overlay" aria-hidden="true" />
      <div className="container blog-header-content">
        <h1 id="blog-post-title">{title}</h1>
        <div className="blog-header-summary">
          <FormattedDate date={date} emoji={true} />
          <div>{readingTime}</div>
          {tags && tags.length > 0 ? (
            <TagList tags={tags} emoji={true} className="inline" />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
