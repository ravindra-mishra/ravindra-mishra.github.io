import config from "./config";

/** Absolute URL for meta tags and JSON-LD (handles root-relative paths). */
export function absoluteFromSiteRoot(pathOrUrl: string | undefined): string {
  if (!pathOrUrl)
    return `${config.base_url.replace(/\/$/, "")}/images/logo.png`;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = config.base_url.replace(/\/$/, "");
  const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${p}`;
}
