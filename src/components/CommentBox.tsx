import { FC, useEffect } from "react";
// import {commentBox } from "commentbox.io"

export interface CommentBoxProps {
  className?: string;
}

const CommentBox: FC<CommentBoxProps> = ({ className }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically import the `commentbox.io` library
      (async () => {
        const { default: commentBox } = await import("commentbox.io");

        const projectId = process.env.NEXT_PUBLIC_COMMENTBOX_PROJECT_ID;
        if (!projectId) {
          console.error("NEXT_PUBLIC_COMMENTBOX_PROJECT_ID is not defined");
          return;
        }

        const removeCommentBox = commentBox(projectId);

        // Cleanup on component unmount
        return () => {
          if (removeCommentBox) removeCommentBox();
        };
      })();
    }
  }, []);

  return <div className={`commentbox ${className}`}></div>;
};

export default CommentBox;
