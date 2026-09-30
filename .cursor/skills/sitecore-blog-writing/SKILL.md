---
name: sitecore-blog-writing
description: >-
  Write or update Ravindra Mishra Sitecore blog posts in this repo—Markdown under
  content/blogs/, SEO frontmatter, uploads images, lists for structure, continuity
  between sections, and optional overview/key-terms/scenario patterns. Use when
  creating a blog, editing content/blogs/*.md, extracting SEO from a draft, adding
  banners/diagrams, or aligning a post with site blogging conventions.
paths:
  - "content/blogs/**/*.md"
  - "public/uploads/**"
  - "content/meta/tags.yml"
---

# Sitecore blog writing (this repo)

Apply this skill when drafting or revising posts for Ravindra’s personal site.
Keep language simple and instructional; keep product/API names and technical
details precise where they matter.

## File & routing

| Item | Rule |
|------|------|
| Path | `content/blogs/<slug>.md` |
| URL slug | **Filename without `.md`** (routing ignores a mismatched frontmatter slug) |
| Frontmatter `slug` | Must match the filename |
| Tags | Only slugs that exist in `content/meta/tags.yml` (add a tag there first if new) |
| Author | Default `"Ravindra Mishra"` |

Slug style: lowercase kebab-case (`sitecore-cdp-personalize-apis-practical-reference`).

## Required frontmatter (SEO)

```yaml
title: "Clear, searchable title with product intent"
description: Longer summary for listings and context (1–2 sentences).
metaDescription: Punchier search/social snippet (aim ~150–160 chars).
keywords: comma-separated phrases, product + intent, no fluff
featuredImage: /uploads/blog-<topic>.jpg   # or .png
featuredImageAlt: One descriptive sentence of the banner (SEO + a11y)
slug: same-as-filename
date: September 30, 2026 5:57 PM
author: "Ravindra Mishra"
tags:
  - tag: sitecore
  - tag: sitecore-cdp
```

**Optional (use when they fit):**

| Field | When |
|-------|------|
| `modifiedDate` | Content was meaningfully updated after `date` |
| `faq` | Q&A that belongs in FAQPage JSON-LD (how-to / reference posts) |
| `howto` | Ordered procedure for HowTo JSON-LD |
| `originalUrl` / `source` | Archive / republished posts only |
| `canonicalUrl` | Only if canonical must differ from site default |

`description` ≠ `metaDescription`: listing depth vs search snippet.

## Images

1. Store files in `public/uploads/`.
2. Reference as `/uploads/<filename>`.
3. Featured banner naming: prefer `blog-<slug-or-topic>.jpg|png`.
4. Inline markdown:

```markdown
![Short descriptive alt](/uploads/file.png "Optional title matching the idea")
```

5. For diagrams that replace ASCII/code art: image + **one-line italic caption** under it is enough for SEO context.
6. Never invent image URLs; copy/generate into `public/uploads/` first.

## Body structure — apply only when applicable

Do **not** force every section into every post. Choose what the topic needs.

| Section | Use when |
|---------|----------|
| Lead / intro | Always — what this is, who it’s for, scope (and what it is *not*) |
| Overview | Conceptual or multi-part topics |
| Key terms | Many product/API terms; prefer a compact table |
| Assumptions / prerequisites | Reader must have accounts, keys, versions, prior parts |
| Scenario | A concrete walkthrough (audience, page, goal) helps |
| Mental model / how pieces connect | Architecture or multi-system flows (diagram OK) |
| Numbered API/feature sections | Reference posts covering multiple surfaces |
| Step-by-step | How-to posts (`## Step N — …` or `### Step N`) |
| Troubleshooting | Failure modes are non-obvious |
| Version reminder / quick reference | Multi-version APIs or long references |
| Official documentation / References | Link to Sitecore (or other) docs |
| Soft close | Brief wrap-up; comments invite is fine |

Separate major `##` blocks with `---` when the post is long or reference-style.

### Continuity (no disconnection)

- End a section with a **short bridge** into the next (“With a guest `ref` in hand, next attach extensions…”).
- Keep a single reading path: overview → prerequisites → scenario/steps → deep dives → reference → close.
- Series posts: link overview / previous / next; state “you are here.”
- Call out scope gaps once (out of scope), then stay on the path.

### Per-topic “at a glance” (APIs, tools, major features)

When a section covers a distinct API or capability, open with four short bullets (1 line each):

- **Use:** why call it
- **Prerequisites:** auth, host, prior IDs/files
- **Input:** what you send
- **Output:** what you get

Skip this for pure narrative or tiny tips.

### Official docs links

For reference sections (especially APIs), put just under the heading:

```markdown
**Official documentation:** [Readable name – Sitecore](https://doc.sitecore.com/...)
```

Also gather key links under a closing `### Official documentation` or `## References` when the post is long.

## Lists — numbers, alpha, bullets (required habit)

Use lists to **group related ideas**; do not listify every sentence.

| Form | Prefer for |
|------|------------|
| **Numbered (`1. 2. 3.`)** | Sequences, steps, ordered API walkthroughs, search-then-create patterns |
| **Alpha (`a)` / `b)` or A) / B)** | Small mutually exclusive options (auth models, flow types) |
| **Bullets** | Unordered facts, prerequisites, event types, tips, hierarchies |

Nested bullets OK for parent → children (Order → Order Item).  
Keep comparison matrices and regional URL maps as **tables**.

## SEO heading hierarchy

1. One clear `title` (H1 via layout) — do not repeat a competing H1 in the body.
2. `##` = main topics (searchable phrases).
3. `###` = substeps, examples, flow types.
4. Avoid skipping levels (don’t jump `##` → `####`).
5. Endpoint callouts: label + fenced `http` block, then `bash`/`json` example:

```markdown
1. **Search guests**

```http
GET https://api-engage-eu.sitecorecloud.io/v2.1/guests?email=jane.doe@example.com
```
```

## Code fences

Always set a language when highlighting matters:

| Content | Fence |
|---------|--------|
| curl / shell | `bash` |
| Method + URL | `http` |
| JSON bodies | `json` |
| JS/TS samples | `javascript` or `typescript` |
| GraphQL | `graphql` |
| SQL | `sql` |
| XML / layout | `xml` |
| Diagrams / pure paths | `text` |

Prism in this site loads bash, http, javascript, json, sql, csharp, powershell, markup—tag accordingly.

## Tone & language

- Direct, practical, reader-friendly English.
- First person OK on experience/reference posts (“I used…”, “worth remembering…”).
- Explain jargon once (Key terms or first use); then use the precise term.
- Prefer concrete examples (real-shaped payloads, regional hosts) over abstract theory.
- Do not invent Sitecore product behavior; prefer official docs links when unsure.

## Checklist before finishing a new/updated post

1. [ ] File at `content/blogs/<slug>.md`; slug matches filename  
2. [ ] Frontmatter: title, description, metaDescription, keywords, featuredImage, featuredImageAlt, date, tags  
3. [ ] Tags exist in `content/meta/tags.yml`  
4. [ ] Banner (and inline images) in `public/uploads/`  
5. [ ] Lists used where topics group; tables for comparisons  
6. [ ] Sections connect with bridges; no orphan jumps  
7. [ ] Optional patterns only where they earn their place  
8. [ ] Code fences language-tagged; docs links where APIs/features are covered  
9. [ ] `faq` / `howto` added if the post is procedural and benefits from JSON-LD  

## Anti-patterns

- Forcing Overview + Key terms + Scenario + Assumptions into a short tip post  
- Untagged code fences for curl/JSON/JS on new posts  
- Featured image without alt text  
- Dumping ASCII diagrams when a clear image + one-line caption exists  
- Hard-coding one region as the only truth without saying “swap for your host”  
- New tag slugs not registered in `tags.yml`  
- Breaking the reading path with unrelated side quests mid-article  
