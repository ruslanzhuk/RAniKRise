import React from "react";
import { Link } from "react-router-dom";
import { AdminComment } from "../../../../api/types/adminAll.types";
import CommentActions from "./CommentActions";

interface Props {
  comments: AdminComment[];
  onDelete: (id: number) => void;
  onBlock: (userId: string) => void;
  linkMode?: "absolute" | "relative";
}

const targetTypeToPath = (targetType: AdminComment["targetType"]) => {
  switch (targetType) {
    case "Anime":
      return "anime";
    case "Post":
      return "posts";
    case "ClubPost":
      return "club-posts";
    case "User":
      return "users";
    default:
      return "";
  }
};

const CommentRow: React.FC<{
  comment: AdminComment;
  onDelete: (id: number) => void;
  onBlock: (userId: string) => void;
  level?: number;
  linkMode: "absolute" | "relative";
}> = ({ comment, onDelete, onBlock, level = 0, linkMode }) => {
  const section = targetTypeToPath(comment.targetType);

  const link =
    linkMode === "absolute"
      ? `/xkey/broadmin/comments/${section}/${comment.id}`
      : `${comment.id}`;

  return (
    <>
      <tr className="border-t border-gray-700 hover:bg-gray-900">
        <td className="p-2" style={{ paddingLeft: `${level * 20}px` }}>
          <div className="font-semibold">{comment.username}</div>
          <div className="text-xs text-gray-400">{comment.email}</div>
        </td>

        <td className="p-2 max-w-xl break-words">
          <Link to={link} className="text-blue-400 hover:underline block">
            {comment.content}
          </Link>
        </td>

        <td className="p-2 text-sm text-center">
          {new Date(comment.createdAt).toLocaleString()}
        </td>

        <td className="p-2">
          <CommentActions comment={comment} onDelete={onDelete} onBlock={onBlock} />
        </td>
      </tr>

      {comment.replies?.map((reply) => (
        <CommentRow
          key={reply.id}
          comment={reply}
          onDelete={onDelete}
          onBlock={onBlock}
          level={level + 1}
          linkMode={linkMode}
        />
      ))}
    </>
  );
};

const CommentTable: React.FC<Props> = ({
  comments,
  onDelete,
  onBlock,
  linkMode = "relative",
}) => {
  if (!comments.length)
    return <div className="text-gray-400 text-center py-10">No comments found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800 text-gray-200">
          <tr>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Comment</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              onDelete={onDelete}
              onBlock={onBlock}
              linkMode={linkMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentTable;
