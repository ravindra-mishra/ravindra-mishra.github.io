import type { FC, ReactNode } from "react";
import { slugifyHeading } from "@/lib/blogToc";

interface MarkdownHeadingProps {
  level: 2 | 3;
  children?: ReactNode;
}

function textFromChildren(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }
  if (typeof children === "object" && "props" in children) {
    const el = children as { props?: { children?: ReactNode } };
    return textFromChildren(el.props?.children);
  }
  return "";
}

const MarkdownHeading: FC<MarkdownHeadingProps> = ({ level, children }) => {
  const text = textFromChildren(children);
  const id = slugifyHeading(text);
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag id={id}>{children}</Tag>;
};

export default MarkdownHeading;
