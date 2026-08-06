"use client";

import { FC, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export interface CommentBoxProps {
  className?: string;
}

const CommentBox: FC<CommentBoxProps> = ({ className }) => {
  const { theme } = useTheme();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const host = hostRef.current;
    let removeCommentBox: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { default: commentBox } = await import("commentbox.io");
      if (cancelled) return;

      const projectId = process.env.NEXT_PUBLIC_COMMENTBOX_PROJECT_ID;
      if (!projectId) {
        console.error("NEXT_PUBLIC_COMMENTBOX_PROJECT_ID is not defined");
        return;
      }

      const isDark = theme === "dark";
      removeCommentBox = commentBox(projectId, {
        backgroundColor: isDark ? "#161d27" : "#ffffff",
        textColor: isDark ? "#e8ecf1" : "#1a2332",
        subtextColor: isDark ? "#9aa5b5" : "#5a6577",
      });
    })();

    return () => {
      cancelled = true;
      removeCommentBox?.();
      if (host) {
        host.innerHTML = "";
      }
    };
  }, [theme]);

  return (
    <div
      ref={hostRef}
      key={theme}
      className={`commentbox ${className ?? ""}`.trim()}
      data-theme={theme}
    />
  );
};

export default CommentBox;
