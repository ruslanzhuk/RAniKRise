import { useEffect, useState } from "react";
import { CommentDTO } from "../../api/types/comment.types";
import { commentApi } from "../../api/userCommentApi";
import CommentEditor from "../comments/CommentEditor";
import CommentItem from "../comments/CommentItem";
import { useAuth } from "../../context/AuthContext";
import BlockedNotice from "./BlockedNotice";

interface Props {
  profileUserId: string;
}

const PAGE_SIZE = 10;

const UserCommentSection = ({ profileUserId }: Props) => {
  const { user } = useAuth();

  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  /* ---------------- LOAD COMMENTS ---------------- */

  useEffect(() => {
    setLoading(true);
    commentApi
      .getUserComments(profileUserId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [profileUserId]);

  /* ---------------- REPLIES ---------------- */

  const addReplyRecursive = (
    list: CommentDTO[],
    parentId: number,
    reply: CommentDTO
  ): CommentDTO[] =>
    list.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [reply, ...(c.replies || [])] };
      }
      if (c.replies?.length) {
        return { ...c, replies: addReplyRecursive(c.replies, parentId, reply) };
      }
      return c;
    });

  const handleReplyAdded = (parentId: number, reply: CommentDTO) => {
    setComments((prev) => addReplyRecursive(prev, parentId, reply));
  };

  /* ---------------- DELETE ---------------- */

  const removeCommentRecursive = (
    list: CommentDTO[],
    commentId: number
  ): CommentDTO[] =>
    list
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: c.replies ? removeCommentRecursive(c.replies, commentId) : [],
      }));

  const requestDelete = (commentId: number) => {
    setCommentToDelete(commentId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      await commentApi.deleteComment(commentToDelete);
      setComments((prev) => removeCommentRecursive(prev, commentToDelete));
    } catch {
      alert("Failed to delete comment");
    } finally {
      setShowConfirm(false);
      setCommentToDelete(null);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Profile comments ({comments.length})
      </h2>

      {/* Editor */}
      {user && (
        user.isBlocked ? (
          <BlockedNotice />
        ) : (
          <CommentEditor
            targetType="User"
            targetId={profileUserId}
            onCreated={(newComment) =>
              setComments((prev) => [newComment, ...prev])
            }
          />
        )
      )}

      {loading && <p className="text-gray-400 mt-4">Loading comments...</p>}

      {!loading && comments.length === 0 && (
        <p className="text-gray-400 mt-4">No comments yet.</p>
      )}

      <div className="space-y-6 mt-6">
        {comments.slice(0, visibleCount).map((comment) => {
          const canDelete =
            user && (comment.userId === user.id || profileUserId === user.id);

          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReplyAdded={handleReplyAdded}
              onDelete={canDelete ? () => requestDelete(comment.id) : undefined}
              targetId={profileUserId}
            />
          );
        })}
      </div>

      {/* Load more */}
      {visibleCount < comments.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
          >
            Load more comments
          </button>
        </div>
      )}

      {/* Modal confirmation */}
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

export default UserCommentSection;
