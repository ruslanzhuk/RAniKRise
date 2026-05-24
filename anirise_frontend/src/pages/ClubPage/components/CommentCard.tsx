import React, { useState } from "react";
import { CommentDTO } from "../../../api/types/comment.types";
import { ReactionType } from "../../../api/types/club.types";
import ReactionButtons from "./ReactionButtons";
import CommentForm from "./CommentForm";
import HtmlContent from "../../../components/HtmlContent";
import { useAuth } from "../../../context/AuthContext";

interface Props {
  comment: CommentDTO;
  onReact: (commentId: number, reaction: ReactionType) => void;
  depth?: number;
}

const CommentCard: React.FC<Props> = ({ comment, onReact, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuth();

  const postId =
    comment.targetType === "ClubPost" ? comment.targetIdLong! : undefined;

  const isBlocked = user?.isBlocked === true;

  return (
    <div
      className={`
        border rounded p-3
        bg-white dark:bg-neutral-900
        border-gray-200 dark:border-neutral-800
        ${depth > 0 ? "ml-6" : ""}
      `}
    >
      <div className="flex justify-between">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {comment.username}
        </div>
        <div className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </div>
      </div>

      <HtmlContent
        html={comment.content}
        className="
          prose max-w-none text-sm my-1
          text-gray-800 dark:text-gray-100
          dark:prose-invert
        "
      />

      <div className="flex items-center gap-2">
        <ReactionButtons
          likes={comment.likes}
          dislikes={comment.dislikes}
          userReaction={comment.userReaction}
          onReact={(reaction: ReactionType) =>
            onReact(comment.id, reaction)
          }
        />

        {/* ===== REPLY BUTTON ===== */}
        {postId && user && !isBlocked && (
          <button
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </button>
        )}
      </div>

      {/* ===== BLOCKED MESSAGE INSTEAD OF FORM ===== */}
      {postId && user && isBlocked && (
        <div className="mt-2 text-xs text-red-500">
          You are not allowed to reply.
          <div className="text-red-400">
            Your account has been blocked. Please contact support.
          </div>
        </div>
      )}

      {/* ===== REPLY FORM ===== */}
      {showReplyForm && postId && user && !isBlocked && (
        <CommentForm
          postId={postId}
          replyToCommentId={comment.id}
          onCommentAdded={async () => setShowReplyForm(false)}
          onCancelReply={() => setShowReplyForm(false)}
        />
      )}

      {/* ===== REPLIES ===== */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply: CommentDTO) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReact={onReact}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
