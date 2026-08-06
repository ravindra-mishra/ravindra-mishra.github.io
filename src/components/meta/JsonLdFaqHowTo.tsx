import Head from "next/head";
import { jsonLdScriptProps } from "react-schemaorg";
import type { FAQPage, HowTo, WithContext } from "schema-dts";

import type { FC } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToData {
  name: string;
  description?: string;
  steps: HowToStep[];
}

export interface JsonLdFaqHowToProps {
  faq?: FaqItem[];
  howto?: HowToData;
}

/**
 * Optional FAQPage / HowTo JSON-LD for posts that declare structured Q&A or steps
 * in front matter. Omit on narrative posts.
 */
const JsonLdFaqHowTo: FC<JsonLdFaqHowToProps> = ({ faq, howto }) => {
  const scripts: WithContext<FAQPage | HowTo>[] = [];

  if (faq && faq.length > 0) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  if (howto && howto.steps?.length > 0) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: howto.name,
      ...(howto.description ? { description: howto.description } : {}),
      step: howto.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    });
  }

  if (scripts.length === 0) return null;

  return (
    <Head>
      {scripts.map((data, i) => (
        <script
          key={`faq-howto-${i}`}
          {...jsonLdScriptProps(data)}
        />
      ))}
    </Head>
  );
};

export default JsonLdFaqHowTo;
