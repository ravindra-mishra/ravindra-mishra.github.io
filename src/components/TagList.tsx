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
          <li
            key={index}
            className="button button-primary"
          >{`#${tagObj.tag}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default TagList;
