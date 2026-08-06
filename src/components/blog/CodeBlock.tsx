"use client";

import { useState, type FC, type ReactNode } from "react";

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const el = node as { props?: { children?: ReactNode } };
    return extractText(el.props?.children);
  }
  return "";
}

const CodeBlock: FC<CodeBlockProps> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const text = extractText(children).replace(/\n$/, "");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="code-block">
      <button type="button" className="code-block-copy" onClick={onCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={className}>{children}</pre>
    </div>
  );
};

export default CodeBlock;
