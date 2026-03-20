import config from "@/lib/config";
import Head from "next/head";
import { jsonLdScriptProps } from "react-schemaorg";
import type { BreadcrumbList } from "schema-dts";

import type { FC } from "react";

export interface JsonLdBreadcrumbListProps {
  /** Path only, e.g. `/blogs/my-post` */
  path: string;
  title: string;
}

/**
 * BreadcrumbList JSON-LD for blog posts (Home → Blog → Article).
 * Helps search and answer engines relate the page to the site hierarchy.
 */
const JsonLdBreadcrumbList: FC<JsonLdBreadcrumbListProps> = ({ path, title }) => {
  const base = config.base_url.replace(/\/$/, "");
  return (
    <Head>
      <script
        {...jsonLdScriptProps<BreadcrumbList>({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${base}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${base}/blogs`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: title,
              item: `${base}${path}`,
            },
          ],
        })}
      />
    </Head>
  );
};

export default JsonLdBreadcrumbList;
