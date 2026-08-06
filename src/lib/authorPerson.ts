import config from "@/lib/config";
import type { Person } from "schema-dts";

/** Shared author Person graph for BlogPosting / WebSite JSON-LD (E-E-A-T). */
export function getAuthorPerson(name = "Ravindra Mishra"): Person {
  const base = config.base_url.replace(/\/$/, "");
  const sameAs = [
    config.github_account,
    config.linkedin_account,
    config.stackexchange_account,
  ].filter((url): url is string => Boolean(url && url.trim()));

  return {
    "@type": "Person",
    name,
    url: `${base}/about`,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
