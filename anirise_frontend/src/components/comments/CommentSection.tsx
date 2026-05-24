import { useEffect, useState } from "react";
import { CommentDTO } from "../../api/types/comment.types";
import { animeCommentApi } from "../../api/animeCommentApi";
import { commentApi } from "../../api/userCommentApi";
import CommentEditor from "./CommentEditor";
import CommentItem from "./CommentItem";
import { useAuth } from "../../context/AuthContext";
import BlockedNotice from "./BlockedNotice";

interface Props {
  animeId: number;
}

const PAGE_SIZE = 10;

const CommentSection = ({ animeId }: Props) => {
  const { user } = useAuth();

  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    animeCommentApi
      .getAnimeComments(animeId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [animeId]);

  /* ------------------ ADD REPLY ------------------ */

  const addReplyRecursive = (
    list: CommentDTO[],
    parentId: number,
    reply: CommentDTO
  ): CommentDTO[] => {
    return list.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [reply, ...(c.replies || [])],
        };
      }

      if (c.replies?.length) {
        return {
          ...c,
          replies: addReplyRecursive(c.replies, parentId, reply),
        };
      }

      return c;
    });
  };

  const handleReplyAdded = (parentId: number, reply: CommentDTO) => {
    setComments((prev) =>
      addReplyRecursive(prev, parentId, reply)
    );
  };

  /* ------------------ DELETE ------------------ */

  const removeCommentRecursive = (
    list: CommentDTO[],
    commentId: number
  ): CommentDTO[] => {
    return list
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies
          ? removeCommentRecursive(c.replies, commentId)
          : [],
      }));
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
        await commentApi.deleteComment(commentToDelete);
        setComments(prev =>
        removeCommentRecursive(prev, commentToDelete)
        );
    } catch {
        alert("Failed to delete comment");
    } finally {
        setShowConfirm(false);
        setCommentToDelete(null);
    }
    };

    // Виклик при натисканні на кнопку Delete
    const requestDelete = (commentId: number) => {
        setCommentToDelete(commentId);
        setShowConfirm(true);
    };

  /* ------------------ RENDER ------------------ */

  return (
    <section className="
      mt-12 p-8 rounded-2xl
      bg-gradient-to-br from-black via-gray-900 to-black
      border border-cyan-500/20
      shadow-[0_0_40px_rgba(34,211,238,0.18)]
    ">
      <h2 className="text-2xl font-semibold mb-4
        text-cyan-300 flex items-center gap-2">
        💬 Comments ({comments.length})
      </h2>

      {/* Editor */}
      {user ? (
        user.isBlocked ? (
          <BlockedNotice />
        ) : (
          <CommentEditor
            targetType="Anime"
            targetId={animeId}
            onCreated={(newComment) =>
              setComments((prev) => [newComment, ...prev])
            }
          />
        )
      ) : (
        <p className="text-gray-400 mb-4">
          Log in to write a comment.
        </p>
      )}

      {/* Content */}
      {loading && (
        <p className="text-gray-400">
          Loading comments...
        </p>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-gray-400 mt-4">
          No comments yet. Be the first to comment!
        </p>
      )}

      <div className="space-y-6 mt-6">
        {comments.slice(0, visibleCount).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplyAdded={handleReplyAdded}
            onDelete={() => requestDelete(comment.id)}
            targetId={animeId}
          />
        ))}
      </div>

      {/* Load more */}
      {visibleCount < comments.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() =>
              setVisibleCount((v) => v + PAGE_SIZE)
            }
            className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
          >
            Load more comments
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <p className="text-gray-200 mb-4">
                Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-end gap-2">
                <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                Yes
                </button>
                <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                No
                </button>
            </div>
            </div>
        </div>
        )}
    </section>

  );
};

export default CommentSection;
