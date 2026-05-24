import { ReactionType } from "../../../api/types/club.types";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

interface Props {
  likes: number;
  dislikes: number;
  userReaction?: ReactionType;
  onReact: (reaction: ReactionType) => void;
}

const ReactionButtons: React.FC<Props> = ({
  likes,
  dislikes,
  userReaction,
  onReact,
}) => {
  const { user } = useAuth();
  const disabled = !user;

  const baseBtn =
    "flex items-center gap-1 px-2 py-1 rounded-md text-sm transition";

  console.log("REACTION BUTTONS:", { likes, dislikes, userReaction });

  return (
    <div className="flex items-center gap-2 text-zinc-500">
      {/* LIKE */}
      <button
        disabled={disabled}
        onClick={e => {
          e.stopPropagation();
          onReact(1);
        }}
        className={`
          ${baseBtn}
          ${disabled && "opacity-50 cursor-not-allowed"}
          ${
            userReaction === 1
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
        `}
      >
        <ThumbsUp size={16} />
        {likes}
      </button>

      {/* DISLIKE */}
      <button
        disabled={disabled}
        onClick={e => {
          e.stopPropagation();
          onReact(-1);
        }}
        className={`
          ${baseBtn}
          ${disabled && "opacity-50 cursor-not-allowed"}
          ${
            userReaction === -1
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
        `}
      >
        <ThumbsDown size={16} />
        {dislikes}
      </button>
    </div>
  );
};

export default ReactionButtons;
