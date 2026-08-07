/**
 * Sanitize CommonMark exported from Perficient / WordPress-style archives.
 * Fixes: literal HTML entities, 4-space-indented lists mistaken for code,
 * and prose/paths wrapped in ``` fences.
 */

const CODE_HINT =
  /\b(using\s+System|namespace\s+\w|public\s+(class|static|void|override)|private\s+|protected\s+|function\s*\(|=>|const\s+\w+\s*=|let\s+\w+|var\s+\w+|\$[a-zA-Z_]\w*|Get-\w+|Set-\w+|New-\w+|Write-Host|param\s*\(|#include\b)/i;

const PATH_HINT =
  /^(?:(?:Core|Master|Web|Database)\s*:\s*)?\/(?:sitecore|Sitecore)\/[^\n]*$/i;

const PROSE_HINT =
  /^(?:Note|Example|For instance|Step\s*\d+|Tip|Warning|Important)\b/i;

/**
 * Decode HTML entities that often leak from WordPress HTML→Markdown exports.
 */
export function normalizeHtmlEntities(text) {
  return String(text)
    .replace(/&amp;nbsp;/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/&#x0*a0;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\u00a0/g, " ");
}

function looksLikeCode(content) {
  const t = content.trim();
  if (!t) return false;
  if (CODE_HINT.test(t)) return true;
  const lines = t.split(/\n/).filter((l) => l.trim());
  if (lines.length >= 3 && /[{};]/.test(t)) return true;
  return false;
}

function looksLikePath(content) {
  const t = content.trim();
  if (!t) return false;
  const lines = t.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 2) return false;
  return lines.every((line) => PATH_HINT.test(line) || /^\/[\w./\-]+$/.test(line));
}

function looksLikeProse(content) {
  const t = content.trim();
  if (!t) return false;
  if (looksLikeCode(t)) return false;
  if (PROSE_HINT.test(t)) return true;
  const lines = t.split(/\n/).filter((l) => l.trim());
  // Short narrative without code punctuation → not a real code block
  if (lines.length <= 3 && !/[;{}=<>]/.test(t) && !PATH_HINT.test(t)) {
    return /[a-zA-Z]{3,}\s+[a-zA-Z]{3,}/.test(t);
  }
  return false;
}

function detectLanguage(content) {
  if (
    /\b(using\s+System|namespace\s+\w|public\s+class|FirstOrDefault|nameof\s*\()\b/.test(
      content
    ) ||
    (/\bvar\s+\w+\s*=/.test(content) && /;/.test(content))
  ) {
    return "csharp";
  }
  if (
    /\b(function\s*\(|=>|const\s+\w+|let\s+\w+)\b/.test(content) &&
    !/\busing\s+System\b/.test(content)
  ) {
    return "javascript";
  }
  if (/\b(Get-\w+|Set-\w+|Write-Host|param\s*\(|\$\w+)/.test(content)) {
    return "powershell";
  }
  if (/\b(SELECT|INSERT|UPDATE|DELETE|FROM)\b/i.test(content)) {
    return "sql";
  }
  return "";
}

/**
 * WordPress/CommonMark often indents list items with 4 spaces.
 * After a blank line, CommonMark treats that as an indented code block.
 */
export function dedentIndentedProse(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    const listMatch = line.match(/^ {4,}([-*+] |\d+\. )(.*)$/);
    if (listMatch) {
      out.push(`${listMatch[1]}${listMatch[2]}`);
      continue;
    }

    const indented = line.match(/^ {4,}(.*)$/);
    if (indented && !CODE_HINT.test(indented[1])) {
      out.push(indented[1]);
      continue;
    }

    out.push(line);
  }

  return out.join("\n");
}

/**
 * Unwrap prose/path fences; keep real code and apply language tags.
 * @param {string} body
 * @param {(string|null)[]} [langHints] optional per-fence language overrides (null = auto)
 */
export function sanitizeFences(body, langHints = []) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let i = 0;
  let hintIdx = 0;

  while (i < lines.length) {
    const open = lines[i].match(/^```(.*)$/);
    if (!open) {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    const existingLang = open[1].trim();
    const contentLines = [];
    i += 1;
    while (i < lines.length && !/^```/.test(lines[i])) {
      contentLines.push(lines[i]);
      i += 1;
    }
    // skip closing ```
    if (i < lines.length && /^```/.test(lines[i])) i += 1;

    const content = contentLines.join("\n");
    const hint = langHints[hintIdx++];
    const trimmed = content.trim();

    if (looksLikePath(content)) {
      out.push(`\`${trimmed}\``);
      out.push("");
      continue;
    }

    if (!existingLang && looksLikeProse(content)) {
      out.push(trimmed);
      out.push("");
      continue;
    }

    if (!existingLang && !looksLikeCode(content) && hint == null) {
      // Unlabeled, non-code, no explicit keep hint → treat as prose
      if (trimmed) {
        out.push(trimmed);
        out.push("");
      }
      continue;
    }

    const lang =
      existingLang ||
      (hint && hint !== null ? hint : "") ||
      detectLanguage(content);
    out.push(lang ? `\`\`\`${lang}` : "```");
    out.push(...contentLines);
    out.push("```");
  }

  return out.join("\n");
}

/**
 * Full archive-body cleanup used by the Perficient import script.
 */
export function sanitizeArchiveMarkdown(body, langHints = []) {
  let out = normalizeHtmlEntities(body);
  out = dedentIndentedProse(out);
  out = sanitizeFences(out, langHints);
  out = out.replace(/\u00a0/g, " ");
  out = out.replace(/[ \t]+\n/g, "\n");
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim() + "\n";
}
