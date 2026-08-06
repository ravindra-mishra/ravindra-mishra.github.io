import { absoluteFromSiteRoot } from "@/lib/absoluteUrl";
import config from "@/lib/config";
import Head from "next/head";

import type { FC } from "react";

export interface OpenGraphMetaProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  /** Use `article` for blog posts; `website` for listings and static pages. */
  ogType?: "website" | "article";
  /** ISO 8601 — include with `ogType="article"` for richer previews. */
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  /** Profile or about URL for `article:author`. */
  articleAuthor?: string;
  /** Topic labels rendered as multiple `article:tag` properties. */
  articleTags?: string[];
}

const OpenGraphMeta: FC<OpenGraphMetaProps> = ({
  url,
  title,
  description,
  image,
  ogType = "website",
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleTags,
}) => {
  return (
    <Head>
      <meta property="og:site_name" content={config.site_title} />
      <meta property="og:url" content={config.base_url + url} />
      <meta property="og:title" content={title ? [title, config.site_title].join(" | ") : ""} />
      <meta property="og:description" content={description ? description : config.site_description} />
      <meta property="og:image" content={absoluteFromSiteRoot(image)} />
      {image ? (
        <meta property="og:image:alt" content={title ? title : config.site_title} />
      ) : null}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_US" />
      {ogType === "article" && articlePublishedTime ? (
        <meta property="article:published_time" content={articlePublishedTime} />
      ) : null}
      {ogType === "article" && articleModifiedTime ? (
        <meta property="article:modified_time" content={articleModifiedTime} />
      ) : null}
      {ogType === "article" && articleAuthor ? (
        <meta property="article:author" content={articleAuthor} />
      ) : null}
      {ogType === "article" && articleTags
        ? articleTags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))
        : null}
    </Head>
  );
};

export default OpenGraphMeta;
