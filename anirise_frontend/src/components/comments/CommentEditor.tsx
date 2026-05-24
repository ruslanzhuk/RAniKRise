import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { CommentDTO } from "../../api/types/comment.types";
import { commentApi } from "../../api/userCommentApi";
import { animeCommentApi } from "../../api/animeCommentApi";
import { useAuth } from "../../context/AuthContext";

interface Props {
  targetType: "User" | "Anime" | "Post";
  targetId: string | number;
  onCreated: (comment: CommentDTO) => void;
  replyToCommentId?: number;
  onCancelReply?: () => void;
}

const CommentEditor = ({
  targetType,
  targetId,
  onCreated,
  replyToCommentId,
  onCancelReply,
}: Props) => {
  const { user } = useAuth();

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

  const { quill, quillRef } = useQuill({
    modules,
    theme: "snow",
  });

  useEffect(() => {
    if (!quill) return;

    const toolbar = quill.container.querySelector(".ql-toolbar");
    if (toolbar) {
      toolbar.classList.add("ql-toolbar-dark");
    }

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }, [quill]);

  const handleSubmit = async () => {
    if (!quill) return;
    const textOnly = quill.getText().trim();
    if (!textOnly) return;

    setLoading(true);
    try {
      let newComment: CommentDTO;

      if (targetType === "User") {
        newComment = await commentApi.createUserComment(
          String(targetId),
          content,
          replyToCommentId
        );
      } else if (targetType === "Anime") {
        newComment = await animeCommentApi.createAnimeComment(
          Number(targetId),
          content,
          replyToCommentId
        );
      } else {
        throw new Error("Unknown target type");
      }

      onCreated(newComment);
      quill.setText("");
      setContent("");
      onCancelReply?.();
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  if (user?.isBlocked) {
    return (
      <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-300">
        <p className="font-semibold mb-1">🚫 You are blocked</p>
        <p className="text-sm">
          You cannot write comments or replies until the block is removed.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        bg-black/60
        rounded-xl
        border border-cyan-500/40
        ring-1 ring-cyan-400/25
        shadow-[0_0_25px_rgba(34,211,238,0.25)]
        p-4
      "
    >
      {/* QUILL EDITOR */}
      <div
        ref={quillRef}
        className="
          bg-gradient-to-br from-gray-900 via-black/80 to-gray-900/90
          rounded-lg
          text-gray-100
          min-h-[120px]
          p-2
        "
      />

      {/* BUTTONS */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            bg-gradient-to-r from-cyan-500 to-teal-500
            hover:from-cyan-400 hover:to-teal-400
            text-black font-semibold
            px-5 py-2 rounded-lg
            shadow-md
            disabled:opacity-50
          "
        >
          {loading ? "Sending..." : "Send"}
        </button>

        {onCancelReply && (
          <button
            onClick={onCancelReply}
            className="text-cyan-300 px-3 hover:text-cyan-100 transition"
          >
            Cancel
          </button>
        )}
      </div>

      <style>{`
        .ql-toolbar.ql-toolbar-dark {
          background: #111827 !important;
          border: 1px solid rgba(34, 211, 238, 0.3);
        }
        .ql-toolbar.ql-toolbar-dark .ql-picker,
        .ql-toolbar.ql-toolbar-dark button {
          color: #a5f3fc !important; /* світлі аква іконки */
        }
        .ql-toolbar.ql-toolbar-dark button:hover,
        .ql-toolbar.ql-toolbar-dark .ql-picker:hover {
          color: #22d3ee !important;
        }
        .ql-container {
          background: transparent !important;
          color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
};

export default CommentEditor;
