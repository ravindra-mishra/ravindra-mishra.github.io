/** Path segment for a blog post (leading slash, no base URL). */
export function blogPostPath(slug: string): string {
  return `/blogs/${slug}`;
}
