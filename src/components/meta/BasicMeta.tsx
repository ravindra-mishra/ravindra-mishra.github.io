import Head from "next/head";
import config from "@/lib/config";

import type { FC } from "react";

export interface BasicMetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  url: string;
}

const BasicMeta: FC<BasicMetaProps> = ({
  title,
  description,
  keywords,
  author,
  url,
}) => {
  return (
    <Head>
      <title>
        {title ? [title, config.site_title].join(" | ") : config.site_title}
      </title>
      <meta name="robots" content="index, follow" />
      <meta name="algolia-site-verification" content="F4F5F7C97A08F73B" />
      <meta
        name="description"
        content={description ? description : config.site_description}
      />
      <meta
        name="keywords"
        content={keywords ? keywords.join(",") : config.site_keywords.join(",")}
      />
      {author ? <meta name="author" content={author} /> : null}
      <link rel="canonical" href={config.base_url + url} />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8135207289906277"
        crossOrigin="anonymous"
      ></script>
    </Head>
  );
};

export default BasicMeta;
