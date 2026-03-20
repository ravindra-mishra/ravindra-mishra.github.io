import Link from "next/link";
import type { ComponentPropsWithoutRef, FC } from "react";
import { sameSitePath } from "@/lib/sameSitePath";

type MarkdownAnchorProps = ComponentPropsWithoutRef<"a"> & {
  node?: unknown;
};

/**
 * Renders markdown links: same-site absolute URLs become Next.js client navigations.
 */
const MarkdownLink: FC<MarkdownAnchorProps> = ({
  href,
  children,
  node,
  ...rest
}) => {
  void node;
  const hrefStr = href != null ? String(href) : "";
  const internal = sameSitePath(hrefStr);

  if (internal !== null) {
    return (
      <Link href={internal} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={hrefStr || undefined} {...rest}>
      {children}
    </a>
  );
};

export default MarkdownLink;
