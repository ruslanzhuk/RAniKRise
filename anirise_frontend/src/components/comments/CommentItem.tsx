import { useState } from "react";
import { CommentDTO } from "../../api/types/comment.types";
import CommentEditor from "./CommentEditor";
import { useAuth } from "../../context/AuthContext";
import BlockedNotice from "./BlockedNotice";
import { useUserAvatar } from "../../hooks/useUserAvatar";

interface Props {
  comment: CommentDTO;
  depth?: number;
  onReplyAdded: (parentId: number, reply: CommentDTO) => void;
  onDelete?: (commentId: number) => void;
  targetId?: number | string;
}

const MAX_DEPTH = 10;

const CommentItem = ({
  comment,
  depth = 0,
  onReplyAdded,
  onDelete,
  targetId,
}: Props) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);

  const repliesCount = comment.replies?.length ?? 0;
  const canReply = !!user && depth < MAX_DEPTH;

  const avatarUrl = useUserAvatar(comment.userId);
  const avatarFallback = comment.username?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className="
        relative
        pl-6
        border-l-2 border-cyan-500/20
        hover:border-cyan-400/40
        transition
      "
    >
      <div
        className="
          bg-gray-900/80
          rounded-xl
          p-4
          border border-cyan-500/10
          shadow-sm
          hover:border-cyan-400/30
          transition
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-sm font-semibold text-cyan-300 shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={comment.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                avatarFallback
              )}
            </div>

            {/* USERNAME + DATE */}
            <div className="flex flex-col">
              <span className="font-semibold text-cyan-300 text-sm">
                {comment.username}
              </span>
              <span className="text-xs text-gray-400 opacity-70">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
            mt-2
            text-gray-200
            leading-relaxed
            prose prose-invert max-w-none
            prose-a:text-cyan-400
            prose-blockquote:border-l-cyan-400
          "
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        {/* ACTIONS */}
        <div className="flex gap-4 mt-3 text-sm text-gray-400 items-center">
          {canReply && (
            user!.isBlocked ? (
              <span className="text-xs text-red-400 italic">
                You are blocked from replying
              </span>
            ) : (
              <button
                onClick={() => setReplying(v => !v)}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                Reply
              </button>
            )
          )}

          {repliesCount > 0 && (
            <button
              onClick={() => setShowReplies(v => !v)}
              className="hover:text-white transition"
            >
              {showReplies
                ? "Hide replies"
                : `View ${repliesCount} repl${repliesCount > 1 ? "ies" : "y"}`}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="ml-auto text-red-500 hover:text-red-400 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* REPLY EDITOR */}
      {replying && targetId !== undefined && (
        user?.isBlocked ? (
          <div className="mt-2">
            <BlockedNotice />
          </div>
        ) : (
          <div className="mt-2">
            <CommentEditor
              targetType={typeof targetId === "string" ? "User" : "Anime"}
              targetId={targetId}
              replyToCommentId={comment.id}
              onCreated={(reply) => {
                onReplyAdded(comment.id, reply);
                setReplying(false);
                setShowReplies(true);
              }}
              onCancelReply={() => setReplying(false)}
            />
          </div>
        )
      )}

      {/* REPLIES */}
      {showReplies && repliesCount > 0 && (
        <div className="mt-4 space-y-4 border-l border-cyan-500/10 pl-4">
          {comment.replies!.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
              onDelete={onDelete}
              targetId={targetId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;


