import type { FC, ReactNode } from "react";

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (typeof node === "object" && "props" in node) {
    return flattenText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

export interface MarkdownReviewNoteProps {
  children?: ReactNode;
}

/**
 * Turns review callouts like `r-01 · REMOVE · START` into anchored asides
 * so editors can confirm IDs from the rendered blog page.
 */
const MarkdownReviewNote: FC<MarkdownReviewNoteProps> = ({ children }) => {
  const text = flattenText(children);
  const match = text.match(/`?(r-\d+)`?\s*·\s*([A-Z/]+)(?:\s*·\s*(START|END))?/i);

  if (!match) {
    return <blockquote>{children}</blockquote>;
  }

  const id = match[1].toLowerCase();
  const action = match[2].toUpperCase();
  const phase = match[3]?.toUpperCase();
  const isEnd = phase === "END";

  return (
    <aside
      id={isEnd ? `${id}-end` : id}
      className={`blog-review-note blog-review-note--${action.toLowerCase().replace("/", "-")}${
        isEnd ? " blog-review-note--end" : ""
      }`}
      data-review-id={id}
      data-review-action={action}
      data-review-phase={phase || "NOTE"}
    >
      {children}
    </aside>
  );
};

export default MarkdownReviewNote;
