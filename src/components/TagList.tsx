import Link from "next/link";
import { FC } from "react";

export interface TagListProps {
  tags: { tag: string }[];
  title?: string;
  emoji: boolean;
  className?: string;
}

const TagList: FC<TagListProps> = ({ tags, title, emoji, className }) => {
  return (
    <div className={`tags ${className}`}>
      {title && <span className="title">Tags: </span>}
      {emoji && <span>🏷️</span>}
      <ul>
        {tags.map((tagObj, index) => (
          <li key={index} className="button button-primary">
            <Link href={`/categories/${tagObj.tag}`} className="tag-link">
              {`#${tagObj.tag}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagList;
