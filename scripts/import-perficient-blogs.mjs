/**
 * One-shot import: ravindra-blogs page bundles → content/blogs + public/uploads.
 * Run: node scripts/import-perficient-blogs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const archiveRoot = path.join(root, "ravindra-blogs", "markdown");
const uploadsDir = path.join(root, "public", "uploads");
const blogsDir = path.join(root, "content", "blogs");

const SERIES_LINKS = [
  [
    /https?:\/\/blogs\.perficient\.com\/2023\/05\/13\/submit-action-to-save-contacts-in-list-manager-basic-implementation\/?/g,
    "/blogs/submit-action-to-save-contacts-in-list-manager-basic-implementation",
  ],
  [
    /https?:\/\/blogs\.perficient\.com\/2023\/06\/01\/submit-action-to-save-contacts-in-list-manager-with-fields-mapping-part-1\/?/g,
    "/blogs/submit-action-to-save-contacts-in-list-manager-with-fields-mapping-part-1",
  ],
  [
    /https?:\/\/blogs\.perficient\.com\/2023\/06\/02\/submit-action-to-save-contacts-in-list-manager-with-fields-mapping-part-2\/?/g,
    "/blogs/submit-action-to-save-contacts-in-list-manager-with-fields-mapping-part-2",
  ],
];

const POSTS = [
  {
    slug: "add-powershell-script-to-the-context-menu-in-sitecore-sxa",
    prefix: "ps-sxa-ctx",
    keywords:
      "Sitecore, Sitecore SXA, PowerShell, SPE, Context Menu, ShowRule, EnableRule",
    tags: ["sitecore-sxa", "sitecore"],
    featuredBasename: "2022-09-28-19_28_55-Clipboard-1024x548.png",
    fenceLangs: ["powershell"],
  },
  {
    slug: "submit-action-to-save-contacts-in-list-manager-basic-implementation",
    prefix: "forms-list-basic",
    keywords:
      "Sitecore, Sitecore Forms, List Manager, Submit Action, xConnect, Contact List",
    tags: ["sitecore"],
    featuredBasename: "FormSubmitAction-SaveToContactList-2-1.gif",
    fenceLangs: [
      null,
      null,
      null,
      null,
      "csharp",
      "csharp",
      "csharp",
    ],
  },
  {
    slug: "submit-action-to-save-contacts-in-list-manager-with-fields-mapping-part-1",
    prefix: "forms-list-map1",
    keywords:
      "Sitecore, Sitecore Forms, SPEAK, Submit Action, Field Mapping, List Manager",
    tags: ["sitecore"],
    featuredBasename:
      "Form-Submit-Action-Save-To-Contact-List-With-Field-Mapping.gif",
    fenceLangs: [null, "javascript"],
  },
  {
    slug: "submit-action-to-save-contacts-in-list-manager-with-fields-mapping-part-2",
    prefix: "forms-list-map2",
    keywords:
      "Sitecore, Sitecore Forms, List Manager, Submit Action, Field Mapping, xConnect",
    tags: ["sitecore"],
    featuredBasename:
      "Form-Submit-Action-Save-To-Contact-List-With-Field-Mapping.gif",
    fenceLangs: ["csharp", "csharp", null],
  },
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter");
  const yaml = match[1];
  const body = match[2];
  const get = (key) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*"([^"]*)"`, "m"));
    return m ? m[1] : "";
  };
  return {
    title: get("title"),
    date: get("date"),
    slug: get("slug"),
    description: get("description"),
    author: get("author"),
    originalUrl: get("original_url"),
    source: get("source"),
    body,
  };
}

function formatLll(iso) {
  // Archive dates are local wall-clock without timezone — format as written.
  const m = String(iso).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/
  );
  if (!m) return iso;
  const [, y, mo, d, hh, mm] = m;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let hour = Number(hh);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${months[Number(mo) - 1]} ${Number(d)}, ${y} ${hour}:${mm} ${ampm}`;
}

function cleanDescription(desc, bodyFallback) {
  let cleaned = desc.replace(/…\s*$/, "").replace(/\u00a0/g, " ").trim();
  // Archive excerpts often cut mid-sentence; prefer first body paragraph.
  if (
    cleaned.length < 80 ||
    /\b(through|the|a|an|to|for|with|and|of)$/i.test(cleaned)
  ) {
    const para = bodyFallback
      .replace(/^---[\s\S]*?---\s*/, "")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`#]/g, "")
      .split(/\n\n+/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .find((p) => p.length > 40);
    if (para) {
      // Prefer complete sentences up to ~200 chars
      const sentences = para.match(/[^.!?]+[.!?]+/g);
      if (sentences) {
        let acc = "";
        for (const s of sentences) {
          const next = (acc + s).trim();
          if (next.length > 220 && acc) break;
          acc = next;
          if (acc.length >= 120) break;
        }
        cleaned = acc || para.slice(0, 220).trim();
      } else {
        cleaned = para.slice(0, 220).replace(/\s+\S*$/, "").trim();
      }
    }
  }
  return cleaned;
}

function metaFromDescription(desc) {
  if (desc.length <= 160) return desc;
  return desc.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

function stripCaptions(body) {
  // [caption ...] ... [/caption] → keep inner markdown image + optional caption as italic
  return body.replace(
    /\[caption[^\]]*\]\s*\r?\n\s*(!\[[^\]]*\]\([^)]+\))\s*\r?\n\s*([\s\S]*?)\[\/caption\]/gi,
    (_m, img, caption) => {
      const cap = caption.replace(/\s+/g, " ").trim();
      return cap ? `${img}\n\n*${cap}*\n` : `${img}\n`;
    }
  );
}

function rewriteImages(body, imageMap) {
  let out = body;
  for (const [from, to] of Object.entries(imageMap)) {
    const re = new RegExp(
      `\\]\\(${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`,
      "g"
    );
    out = out.replace(re, `](${to})`);
  }
  return out;
}

function rewriteSeriesLinks(body) {
  let out = body;
  for (const [re, dest] of SERIES_LINKS) {
    out = out.replace(re, dest);
  }
  return out;
}

function tagUnlabeledFences(body, langs) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let inFence = false;
  let langIdx = 0;
  for (const line of lines) {
    if (/^```/.test(line)) {
      if (!inFence) {
        inFence = true;
        if (line.trim() === "```") {
          const lang = langs[langIdx++];
          out.push(lang ? `\`\`\`${lang}` : "```");
        } else {
          out.push(line);
          langIdx++;
        }
      } else {
        inFence = false;
        out.push(line);
      }
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

function yamlQuote(s) {
  return JSON.stringify(s);
}

function buildMarkdown(meta, post, featuredPath) {
  const description = cleanDescription(meta.description, meta.body);
  const metaDescription = metaFromDescription(description);
  const tagsYaml = post.tags.map((t) => `  - tag: ${t}`).join("\n");

  return `---
title: ${yamlQuote(meta.title)}
description: ${yamlQuote(description)}
metaDescription: ${yamlQuote(metaDescription)}
keywords: ${yamlQuote(post.keywords)}
featuredImage: ${featuredPath}
slug: ${post.slug}
date: ${formatLll(meta.date)}
author: ${yamlQuote(meta.author || "Ravindra Mishra")}
originalUrl: ${yamlQuote(meta.originalUrl)}
source: ${yamlQuote(meta.source)}
tags:
${tagsYaml}
---
${meta.body.trim()}
`;
}

function importPost(post) {
  const dir = path.join(archiveRoot, post.slug);
  const mdPath = path.join(dir, "index.md");
  const imagesDir = path.join(dir, "images");
  const raw = fs.readFileSync(mdPath, "utf8");
  const meta = parseFrontmatter(raw);

  const imageMap = {};
  let featuredPath = null;

  if (fs.existsSync(imagesDir)) {
    for (const file of fs.readdirSync(imagesDir)) {
      const destName = `${post.prefix}-${file}`;
      const dest = path.join(uploadsDir, destName);
      fs.copyFileSync(path.join(imagesDir, file), dest);
      const publicPath = `/uploads/${destName}`;
      imageMap[`images/${file}`] = publicPath;
      if (file === post.featuredBasename) {
        featuredPath = publicPath;
      }
    }
  }

  if (!featuredPath) {
    const first = Object.values(imageMap)[0];
    if (!first) throw new Error(`No images for ${post.slug}`);
    featuredPath = first;
  }

  let body = meta.body;
  body = stripCaptions(body);
  body = rewriteImages(body, imageMap);
  body = rewriteSeriesLinks(body);
  body = tagUnlabeledFences(body, post.fenceLangs);
  // Normalize odd spacing artifacts
  body = body.replace(/\u00a0/g, " ");
  body = body.replace(/\n{3,}/g, "\n\n");

  meta.body = body;
  const out = buildMarkdown(meta, post, featuredPath);
  fs.writeFileSync(path.join(blogsDir, `${post.slug}.md`), out, "utf8");
  console.log(`Imported ${post.slug} (${Object.keys(imageMap).length} images)`);
}

fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(blogsDir, { recursive: true });

for (const post of POSTS) {
  importPost(post);
}

console.log("Done.");
