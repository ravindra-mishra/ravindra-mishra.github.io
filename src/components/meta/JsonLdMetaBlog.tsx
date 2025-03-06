import config from "@/lib/config";
import { formatISO } from "date-fns";
import Head from "next/head";
import { jsonLdScriptProps } from "react-schemaorg";
import { BlogPosting } from "schema-dts";

import type { FC } from "react";

export interface JsonLdMetaProps {
  url: string;
  title: string;
  keywords?: string[];
  date: Date;
  modifiedDate: Date;
  content: string;
  author?: string;
  image?: string;
  description?: string;
}

const JsonLdMetaBlog: FC<JsonLdMetaProps> = ({
  url,
  title,
  keywords,
  date,
  modifiedDate,
  content,
  author,
  image,
  description,
}) => {
  return (
    <Head>
      <script
        {...jsonLdScriptProps<BlogPosting>({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": config.base_url + url,
          },
          headline: title,
          keywords: (keywords ?? []).join(","),
          datePublished: formatISO(date),
          dateModified: formatISO(modifiedDate ?? date),
          author: {
            "@type": "Person",
            name: author,
            url: `${config.base_url}/about`,
          },
          publisher: {
            "@type": "Organization",
            name: "Ravindra Mishra",
            logo: {
              "@type": "ImageObject",
              url: `${config.base_url}/image/logo.png`,
            },
          },
          image: image ? image : `${config.base_url}/image/logo.jpg`,
          description: description,
          articleBody: content,
        })}
      />
    </Head>
  );
};

export default JsonLdMetaBlog;
