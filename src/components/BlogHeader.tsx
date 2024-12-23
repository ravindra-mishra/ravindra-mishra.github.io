import type { FC } from "react";
import FormattedDate from "@/components/FormattedDate";
// import TagList from "./TagList";

export interface BlogHeaderProps {
  className?: string;
  title: string;
  tags: { tag: string }[];
  date: Date;
  readingTime: string;
}

const BlogHeader: FC<BlogHeaderProps> = ({
  className,
  title,
  tags,
  date,
  readingTime,
}) => {
  console.log(tags);
  return (
    <div className={`background-primary blog-header ${className || ""}`}>
      <div className="container">
        <h1>{title}</h1>
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
