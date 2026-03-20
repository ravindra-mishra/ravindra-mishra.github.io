import BasicMeta from "@/components/meta/BasicMeta";
import JsonLdMetaWebsite from "@/components/meta/JsonLdMetaWebsite";
import OpenGraphMeta from "@/components/meta/OpenGraphMeta";
import TwitterCardMeta from "@/components/meta/TwitterCardMeta";
import type { FC } from "react";

export interface WebsiteMetaBundleProps {
  /** Path only, e.g. `/blogs` or `/categories/sitecore` */
  path: string;
  title: string;
  description?: string;
}

/**
 * Standard SEO head tags for static marketing / listing pages (not blog posts).
 * Keeps title, description, canonical, Open Graph, Twitter, and WebSite JSON-LD in sync.
 */
const WebsiteMetaBundle: FC<WebsiteMetaBundleProps> = ({
  path,
  title,
  description,
}) => (
  <>
    <BasicMeta url={path} title={title} description={description} />
    <OpenGraphMeta
      url={path}
      title={title}
      description={description}
      ogType="website"
    />
    <TwitterCardMeta url={path} title={title} description={description} />
    <JsonLdMetaWebsite url={path} title={title} description={description} />
  </>
);

export default WebsiteMetaBundle;
