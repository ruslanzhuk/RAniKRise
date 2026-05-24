import React from "react";
import { ClubPostDTO } from "../../../api/types/club.types";
import ReactionButtons from "./ReactionButtons";
import { useNavigate } from "react-router-dom";
import HtmlContent from "../../../components/HtmlContent";

interface Props {
  post: ClubPostDTO;
  onReact: (reaction: number) => void;
}

const PostCard: React.FC<Props> = ({ post, onReact }) => {
  const navigate = useNavigate();

  const goToPost = () => {
    navigate(`/clubs/${post.clubId}/posts/${post.id}`);
  };

  return (
    <div
      onClick={goToPost}
      className="
        group relative rounded-xl border bg-white dark:bg-zinc-900
        border-zinc-200 dark:border-zinc-800 p-4 transition
        hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700
        cursor-pointer
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {post.authorUsername[0].toUpperCase()}
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            {post.authorUsername}
          </span>
          <span className="text-xs text-zinc-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <HtmlContent
        html={post.content}
        className="text-zinc-800 dark:text-zinc-200 leading-relaxed prose max-w-none"
      />

      {/* MEDIA */}
      {post.mediaUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {post.mediaUrls.map((url, i) => {
            const isGif = url.toLowerCase().endsWith(".gif");
            return (
              <div key={i} className="relative">
                {isGif && (
                  <span className="absolute top-1 right-1 bg-yellow-400 text-xs px-1 rounded z-10">
                    GIF
                  </span>
                )}
                <img
                  src={url}
                  alt="media"
                  className="rounded-lg object-cover max-h-60 w-full transition-transform duration-200 hover:scale-105"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex items-center gap-4">
        <ReactionButtons
          likes={post.likes}
          dislikes={post.dislikes}
          userReaction={post.userReaction}
          onReact={(r) => {
            onReact(r);
          }}
        />
      </div>
    </div>
  );
};

export default PostCard;
