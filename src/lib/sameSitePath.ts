import config from "./config";

/**
 * If `href` targets this site (per `config.base_url`), returns the pathname +
 * search + hash for use with `next/link`. Otherwise returns null.
 * Root-relative paths (`/blogs/...`) are returned as-is.
 */
export function sameSitePath(href: string | undefined): string | null {
  if (href == null || href === "") return null;
  if (href.startsWith("#")) return null;
  if (href.startsWith("/") && !href.startsWith("//")) return href;

  if (!/^https?:\/\//i.test(href)) return null;

  const base = config.base_url.replace(/\/$/, "");
  let link: URL;
  let siteOrigin: string;
  try {
    link = new URL(href);
    siteOrigin = new URL(`${base}/`).origin;
  } catch {
    return null;
  }

  if (link.origin !== siteOrigin) return null;

  let path = `${link.pathname}${link.search}${link.hash}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    path = path.slice(basePath.length) || "/";
  }
  return path;
}
