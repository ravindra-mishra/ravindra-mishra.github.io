# Ravindra Mishra — Portfolio

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222.svg)](https://ravindra-mishra.github.io)

Personal portfolio and technical blog for Ravindra Mishra. This repository is the source for the public site at [ravindra-mishra.github.io](https://ravindra-mishra.github.io).

You are welcome to download, study, modify, and build your own site from this project while following the [GNU General Public License v3.0](LICENSE) and preserving applicable copyright and license notices.

## About

This project is a statically generated website that combines:

- A **portfolio** (skills, experience, certifications, and project summaries)
- A **technical blog** focused on Sitecore, .NET, ASP.NET, and related web development topics

It is intended for developers who want a reference implementation of a content-driven personal site, and for readers looking for practical Sitecore and .NET write-ups. The site is built as a static export so it can be hosted on GitHub Pages.

Content lives in Markdown with YAML front matter. Site-wide metadata (title, description, social links, posts per page) lives in `content/config.json`.

## Features

- Home page with latest blog posts and selected portfolio sections
- Dedicated portfolio page (skills, work experience, certifications, awards, and project summaries)
- Markdown blog posts with tags, pagination, reading time, table of contents, and syntax highlighting
- Category listing and per-tag archive pages
- Light and dark theme, with preference stored in the browser
- SEO-oriented metadata: Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, and RSS
- Optional Google Analytics and Commentbox.io comments
- Static CMS admin UI at `/admin` (Netlify CMS / Decap CMS with Git Gateway)
- GitHub Actions workflow that builds the static export and deploys to GitHub Pages

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 15 (Pages Router) |
| UI | React 19 |
| Language | TypeScript |
| Styling | Sass (SCSS modules under `src/styles`) |
| Content | Markdown in `content/blogs`, [gray-matter](https://github.com/jonschlinkert/gray-matter), [react-markdown](https://github.com/remarkjs/react-markdown), [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Highlighting | [Prism](https://prismjs.com/) |
| CMS | Netlify CMS 2 (loaded from CDN in `public/admin`) |
| Comments | [commentbox.io](https://commentbox.io/) (optional, env-configured) |
| Analytics | `@next/third-parties` Google Analytics (optional) |
| Package manager | npm (`package-lock.json`) |
| Runtime | Node.js 20 (GitHub Actions) |
| Deployment | GitHub Pages via [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml) |
| Output | Static export (`output: "export"` in `next.config.ts`) |

There is no application database and no Next.js API route in this repository. Blog data is read from the filesystem at build time.

## Project Structure

```text
.
├── COPYRIGHT                 # Short GPLv3 notice for original project work
├── LICENSE                   # GNU GPLv3 (official text)
├── content/
│   ├── config.json           # Site title, description, social URLs, pagination
│   ├── blogs/                # Blog posts (Markdown + front matter)
│   └── meta/tags.yml         # Tag names and slugs
├── public/
│   ├── admin/                # Netlify CMS config and admin shell
│   ├── uploads/              # Blog images and screenshots
│   └── …                     # Favicon/manifest, robots, redirects
├── scripts/                  # SEO post-build, blog import helpers
├── src/
│   ├── components/           # Layout, blog UI, portfolio sections, SEO meta
│   ├── lib/                  # Config, blog loading, pagination, URLs
│   ├── pages/                # Pages Router routes
│   ├── styles/               # SCSS (tokens, layout, components, theme)
│   └── types/                # TypeScript types
├── ravindra-blogs/           # Archived Markdown export of older posts
└── .github/workflows/        # GitHub Pages build and deploy
```

**Routes (Pages Router)**

| Path | Purpose |
| --- | --- |
| `/` | Home (latest posts + selected portfolio blocks) |
| `/portfolio` | Full portfolio |
| `/blogs`, `/blogs/[slug]` | Blog index and post |
| `/categories`, `/categories/[tags]` | Tag listing and archives |
| `/about`, `/contact`, `/privacy` | About, contact, privacy policy |
| `/admin` | Content manager (static HTML; not part of the Next.js page tree) |

## Getting Started

### Prerequisites

- Node.js 20 (matching the GitHub Actions workflow)
- npm 10+ (comes with Node)

### Clone and install

```bash
git clone https://github.com/ravindra-mishra/ravindra-mishra.github.io.git
cd ravindra-mishra.github.io
npm ci
```

If you are not using a clean lockfile install, `npm install` also works.

### Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill in values you need. None of the variables are required for a local preview of the static site; comments and analytics stay disabled when their IDs are empty.

```bash
cp .env.example .env.local
```

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
```

This runs `next build` (static export to `out/`), then `next-sitemap`, then `scripts/seo-postbuild.js` (RSS and related SEO files in `out/`).

To serve the Next.js production server locally (after a build):

```bash
npm start
```

For GitHub Pages, the deployed artifact is the `out/` directory, not the `next start` server.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | No | Canonical origin for sitemap, RSS, and absolute URLs. Localhost values are ignored; `content/config.json` `base_url` is used instead. |
| `NEXT_PUBLIC_BASE_PATH` | No | URL prefix when the site is not at the domain root. Leave empty for `https://<user>.github.io`. |
| `NEXT_PUBLIC_COMMENTBOX_PROJECT_ID` | No | Commentbox.io project ID. Without it, the comment widget logs an error and does not load. |
| `NEXT_PUBLIC_GA_TRACKING_ID` | No | Google Analytics measurement ID. Analytics is omitted when unset. |

Do not commit real IDs or secrets. GitHub Actions reads production values from repository **secrets** and **variables** (`NEXT_PUBLIC_COMMENTBOX_PROJECT_ID`, `NEXT_PUBLIC_GA_TRACKING_ID`, `NEXT_PUBLIC_BASE_URL`, optional `NEXT_PUBLIC_BASE_PATH`).

## Available Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Local development server with hot reload |
| `build` | `next build && next-sitemap && node scripts/seo-postbuild.js` | Static export plus sitemap/RSS post-processing |
| `start` | `next start` | Serve a production Next.js build locally |
| `lint` | `next lint` | ESLint via `eslint-config-next` |
| `export` | `next export` | Legacy export command from `package.json`. Static output is already produced by `npm run build` because `next.config.ts` sets `output: "export"`. Prefer `npm run build`. |

Helper scripts (not npm scripts):

- `node scripts/import-perficient-blogs.mjs` — one-shot import from `ravindra-blogs/` into `content/blogs` and `public/uploads`

## Customization

| What | Where |
| --- | --- |
| Site name, description, keywords, social links, posts per page | `content/config.json` |
| Blog posts | `content/blogs/*.md` (front matter: title, dates, tags, featured image, SEO fields) |
| Tag labels | `content/meta/tags.yml` |
| About copy | `src/pages/about.tsx` |
| Contact details | `src/pages/contact.tsx` |
| Privacy policy | `src/pages/privacy.tsx` |
| Experience, skills, projects, awards, certifications | `src/components/Portfolio-components/` |
| Header / footer / social links | `src/components/Layout.tsx`, `src/components/SiteFooter.tsx`, `src/components/Navigation.tsx` |
| Colors and theme tokens | `src/styles/tokens/` and `src/styles/components/_theme.scss` |
| Fonts (Google Fonts + Font Awesome CDN) | `src/pages/_document.tsx` |
| Images | `public/uploads/` (blog); portfolio components also reference `images/…` paths |
| CMS collections | `public/admin/config.yml` |
| SEO post-build / sitemap | `scripts/seo-postbuild.js`, `next-sitemap.config.js` |

## Deployment

The site is configured as a **static export** and is deployed to **GitHub Pages** from the `main` branch by [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml).

1. Enable GitHub Pages with **GitHub Actions** as the source.
2. Configure the `github-pages` environment. Optional repository variables/secrets:
   - `NEXT_PUBLIC_BASE_URL`
   - `NEXT_PUBLIC_BASE_PATH`
   - `NEXT_PUBLIC_GA_TRACKING_ID` (variable)
   - `NEXT_PUBLIC_COMMENTBOX_PROJECT_ID` (secret)
3. Push to `main` (or run the workflow manually). The workflow builds `out/` and deploys it with `actions/deploy-pages`.

For a `username.github.io` repository, the workflow leaves `NEXT_PUBLIC_BASE_PATH` empty and sets `NEXT_PUBLIC_BASE_URL` to `https://<owner>.github.io` unless you override it.

Netlify Identity is loaded in `_document.tsx` for the `/admin` CMS login. Git Gateway / Netlify Identity is a separate hosting concern from GitHub Pages; the admin UI is static files in `public/admin`.

## Contributing

Forks, improvements, and pull requests are welcome. Helpful contributions include bug fixes, accessibility, performance, documentation, and clearer structure.

1. Fork the repository
2. Create a branch for your change
3. Run `npm run lint` and `npm run build` locally
4. Open a pull request describing the change

Please keep existing copyright and license notices intact, and do not add secrets to the repository.

## License

This project is licensed under the **GNU General Public License v3.0 or later** ([GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later.html)). The official license text is in [LICENSE](LICENSE).

You are welcome to use, study, modify, and redistribute this project, including for commercial purposes and as the basis of your own website, in accordance with GPLv3. When you distribute GPL-covered portions or derivative works, GPLv3 requires that you:

- Provide the corresponding source under GPLv3 (or a later GPL version, at your option)
- Preserve applicable copyright and license notices
- License the distributed work under GPLv3 terms (copyleft)

GPLv3 does not require a website footer credit. Attribution and notice obligations are those in the license itself. This project is provided **without warranty**; see the license for details.

A short copyright notice for original project work is in [COPYRIGHT](COPYRIGHT).

## Copyright and Attribution

This project is maintained by Ravindra Mishra and is licensed under the GNU General Public License v3.0. You are welcome to learn from, modify, and build upon the project in accordance with the license. When redistributing GPL-covered portions, please preserve the applicable copyright and license notices required by GPLv3.

Existing on-site copyright lines (for example in the footer) are display text; they do not replace [LICENSE](LICENSE). Third-party libraries and assets are **not** relicensed as GPLv3 by being used here.

## Acknowledgements

Original application code, SCSS, and original writing in this repository are by Ravindra Mishra, except where noted.

**npm dependencies** (not GPLv3; keep their licenses when you redistribute): Next.js, React, Sass, gray-matter, react-markdown, remark-gfm, Prism, date-fns, next-sitemap, ESLint, TypeScript, and the other packages listed in `package.json` / `package-lock.json`. Inspect each package’s license if you redistribute binaries or a bundled site.

**Loaded from CDNs (their own terms apply):**

- [IBM Plex Sans](https://github.com/IBM/plex) and [IBM Plex Mono](https://github.com/IBM/plex) (SIL Open Font License)
- [Poppins](https://fonts.google.com/specimen/Poppins) (SIL Open Font License), via Google Fonts
- [Font Awesome 6](https://fontawesome.com/license/free) Free (icons: CC BY 4.0; fonts: SIL OFL; code: MIT)
- Netlify CMS 2 (`unpkg.com/netlify-cms`)
- Netlify Identity widget (`identity.netlify.com`)

**Default Next.js starter assets** in `public/` (`vercel.svg`, `file.svg`, `window.svg`) come from the create-next-app template and remain under their upstream terms.

**Blog screenshots** in `public/uploads/` and `ravindra-blogs/` include captures of third-party products (for example Sitecore, Microsoft Windows, Excel, and related tools). Those product UIs, names, and trademarks belong to their owners. The screenshots are included as documentation around the posts; they are not relicensed as original GPLv3 artwork.

**Older posts** in `content/blogs` and `ravindra-blogs/` include material originally published on the Perficient blogs archive (`source: "Perficient Blogs Archive"` / `originalUrl` in front matter). Copyright of that previously published material may belong to a former employer or may be shared; confirm rights before treating those posts as solely GPLv3-licensed original work.

**commentbox.io** and **Google Analytics** are third-party services. Using this project does not grant their service terms or trademarks.
