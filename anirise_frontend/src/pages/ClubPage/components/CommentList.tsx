import React from "react";
import { CommentDTO } from "../../../api/types/comment.types";
import { ReactionType } from "../../../api/types/club.types";
import CommentCard from "./CommentCard";

interface Props {
  comments: CommentDTO[];
  onReact: (commentId: number, reaction: ReactionType) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

const CommentList: React.FC<Props> = ({ comments, onReact, onLoadMore, hasMore, loading }) => {
  return (
    <div className="space-y-2">
      {comments.map(c => (
        <CommentCard key={c.id} comment={c} onReact={onReact} />
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="w-full text-center py-2 text-blue-500 hover:underline"
        >
          {loading ? "Loading..." : "Show more comments"}
        </button>
      )}
    </div>
  );
};

export default CommentList;
