declare module 'commentbox.io' {
    interface CommentBoxOptions {
      className?: string; // Optional class name for the comment container
      defaultBoxId?: string; // Optional default ID for the comment box
      tlcParam?: string; // Optional tracking parameter
      backgroundColor?: string; // Optional background color
    }
  
    type CommentBox = (boxId: string, options?: CommentBoxOptions) => () => void;
  
    const commentBox: CommentBox;
    export default commentBox;
  }
  