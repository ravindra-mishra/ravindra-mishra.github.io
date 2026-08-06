declare module "commentbox.io" {
  interface CommentBoxOptions {
    className?: string;
    defaultBoxId?: string;
    tlcParam?: string;
    sortOrder?: "best" | "newest" | "oldest";
    backgroundColor?: string | null;
    textColor?: string | null;
    subtextColor?: string | null;
  }

  type CommentBox = (boxId: string, options?: CommentBoxOptions) => () => void;

  const commentBox: CommentBox;
  export default commentBox;
}
