import React from "react";
import { AdminComment } from "../../../../api/types/adminAll.types";

interface Props {
  comment: AdminComment;  
  onDelete: (id: number) => void;
  onBlock: (userId: string) => void;
}

const CommentActions: React.FC<Props> = ({ comment, onDelete, onBlock }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onDelete(comment.id)}
        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
      >
        Delete
      </button>

      <button
        disabled={comment.isBlocked}
        onClick={() => onBlock(comment.userId)}
        className={`px-2 py-1 rounded text-sm ${
          comment.isBlocked
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-600 text-white"
        }`}
      >
        {comment.isBlocked ? "Blocked" : "Block user"}
      </button>
    </div>
  );
};

export default CommentActions;
