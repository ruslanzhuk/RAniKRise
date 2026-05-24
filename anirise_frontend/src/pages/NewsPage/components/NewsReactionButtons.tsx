import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ReactionType } from "../../../api/news_data";
import { useAuth } from "../../../context/AuthContext";

interface Props {
  likes: number;
  dislikes: number;
  userReaction?: ReactionType | null;
  onReact: (reaction: ReactionType) => void;
}

const NewsReactionButtons: React.FC<Props> = ({
  likes,
  dislikes,
  userReaction,
  onReact,
}) => {
  const { user } = useAuth();
  const disabled = !user;

  const baseBtn =
    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-all";

  return (
    <div className="flex items-center gap-3 text-zinc-500">
      {/* LIKE */}
      <button
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onReact(ReactionType.Like);
        }}
        className={`
          ${baseBtn}
          border-zinc-300 dark:border-zinc-700
          ${disabled && "opacity-50 cursor-not-allowed"}
          ${
            userReaction === ReactionType.Like
              ? "bg-blue-100 border-blue-400 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
        `}
      >
        <ThumbsUp size={16} className="stroke-current" />
        <span>{likes}</span>
      </button>

      {/* DISLIKE */}
      <button
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onReact(ReactionType.Dislike);
        }}
        className={`
          ${baseBtn}
          border-zinc-300 dark:border-zinc-700
          ${disabled && "opacity-50 cursor-not-allowed"}
          ${
            userReaction === ReactionType.Dislike
              ? "bg-red-100 border-red-400 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
        `}
      >
        <ThumbsDown size={16} className="stroke-current" />
        <span>{dislikes}</span>
      </button>
    </div>
  );
};

export default NewsReactionButtons;
