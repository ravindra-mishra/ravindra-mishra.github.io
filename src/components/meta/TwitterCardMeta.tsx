import { absoluteFromSiteRoot } from "@/lib/absoluteUrl";
import config from "@/lib/config";
import Head from "next/head";

import type { FC } from "react";

export interface TwitterCardMetaProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

const TwitterCardMeta: FC<TwitterCardMetaProps> = ({
  url,
  title,
  description,
  image,
}) => {
  return (
    <Head>
      <meta name="twitter:card" content="summary_large_image" />
      {config.twitter_account ? (
        <meta name="twitter:site" content={config.twitter_account} />
      ) : null}
      <meta name="twitter:url" content={config.base_url + url} />
      <meta
        name="twitter:title"
        content={title ? [title, config.site_title].join(" | ") : ""}
      />
      <meta
        name="twitter:description"
        content={description ? description : config.site_description}
      />
      <meta name="twitter:image" content={absoluteFromSiteRoot(image)} />
    </Head>
  );
};

export default TwitterCardMeta;
