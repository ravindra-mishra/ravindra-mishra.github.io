import { absoluteFromSiteRoot } from "@/lib/absoluteUrl";
import { getAuthorPerson } from "@/lib/authorPerson";
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
  /** BCP 47 / ISO 639-1 style language tag for the article. */
  inLanguage?: string;
  wordCount?: number;
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
  inLanguage = "en",
  wordCount,
}) => {
  const imageUrl = absoluteFromSiteRoot(image ?? "/images/logo.png");

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
          inLanguage,
          ...(wordCount != null && wordCount > 0 ? { wordCount } : {}),
          datePublished: formatISO(date),
          dateModified: formatISO(modifiedDate ?? date),
          author: getAuthorPerson(author),
          publisher: {
            "@type": "Organization",
            name: "Ravindra Mishra",
            logo: {
              "@type": "ImageObject",
              url: `${config.base_url}/images/logo.png`,
            },
          },
          image: {
            "@type": "ImageObject",
            url: imageUrl,
          },
          description: description,
          articleBody: content,
        })}
      />
    </Head>
  );
};

export default JsonLdMetaBlog;
