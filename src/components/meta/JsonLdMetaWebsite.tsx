import config from "@/lib/config";
import Head from "next/head";
import { jsonLdScriptProps } from "react-schemaorg";
import { WebSite } from "schema-dts";

import type { FC } from "react";

export interface JsonLdMetaProps {
  url: string;
  title: string;
  keywords?: string[];
  author?: string;
  image?: string;
  description?: string;
}

const JsonLdMetaWebsite: FC<JsonLdMetaProps> = ({
  url,
  title,
  keywords,
  author,
  image,
  description,
}) => {
  return (
    <Head>
      <script
        {...jsonLdScriptProps<WebSite>({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Ravindra Mishra's Blog",
          url: config.base_url,
          // potentialAction: {
          //   "@type": "SearchAction",
          //   target: `${config.base_url}/search?q={search_term_string}`,
          //   "query-input": "required name=search_term_string",
          // },
          mainEntityOfPage: config.base_url + url,
          headline: title,
          keywords: (keywords ?? []).join(","),
          author: {
            "@type": "Person",
            name: author,
          },
          publisher: {
            "@type": "Organization",
            name: "Ravindra Mishra",
            logo: {
              "@type": "ImageObject",
              url: `${config.base_url}/images/logo.png`,
            },
          },
          image: image ? image : `${config.base_url}/images/logo.png`,
          description: description,
        })}
      />
    </Head>
  );
};

export default JsonLdMetaWebsite;
