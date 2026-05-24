import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { clubPostCommentsApi } from "../../../api/clubPostCommentApi";
import { CommentDTO } from "../../../api/types/comment.types";

interface Props {
  postId: number;
  onCommentAdded: (newComment: CommentDTO) => void;
  replyToCommentId?: number;
  onCancelReply?: () => void;
}

const CommentForm: React.FC<Props> = ({
  postId,
  onCommentAdded,
  replyToCommentId,
  onCancelReply,
}) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "blockquote"],
      ["clean"],
    ],
  };

  const { quill, quillRef } = useQuill({ modules, theme: "snow" });

  useEffect(() => {
    if (!quill) return;
    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }, [quill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quill) return;

    const textOnly = quill.getText().trim();
    if (!textOnly) return;

    setLoading(true);

    try {
      const newComment = await clubPostCommentsApi.createComment(
        postId,
        content,
        replyToCommentId
      );

      onCommentAdded(newComment);

      quill.setText("");
      setContent("");

      if (onCancelReply) onCancelReply();
    } catch (err: any) {
      console.error("Failed to post comment:", err);
      alert(err.response?.data?.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-3 space-y-2">
      <div ref={quillRef} />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {onCancelReply && (
          <button
            type="button"
            className="text-gray-500 px-3 py-1"
            onClick={onCancelReply}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
