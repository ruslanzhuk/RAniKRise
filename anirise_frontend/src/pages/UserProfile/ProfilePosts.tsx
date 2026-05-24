import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postApi } from "../../api/postApi";
import type { PostResponseDTO } from "../../api/types/post.types";
import defaultAvatar from "assets/images/default_avatar_7665.png";

interface Props {
  userId: string;
  username: string;
  canViewPosts: boolean;
}

export default function ProfilePosts({ userId, username, canViewPosts }: Props) {
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canViewPosts) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    postApi
      .getUserPosts(userId)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [userId, canViewPosts]);

  if (!canViewPosts) {
    return (
      <div className="mt-8 text-gray-500">
        <h2 className="text-xl font-bold mb-2">Posts</h2>
        <p>This profile is private. You cannot see posts.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-gray-500 mt-4">Loading posts…</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Posts</h2>
        <p className="text-gray-500">User has no posts yet</p>
      </div>
    );
  }

  const latestPosts = posts.slice(0, 3);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Posts</h2>

        {posts.length > 3 && (
          <Link
            to={`/user/${username}/posts`}
            className="text-purple-400 hover:underline text-sm"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {latestPosts.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostPreview({ post }: { post: PostResponseDTO }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <img
          src={post.author.avatarUrl || defaultAvatar}
          className="w-6 h-6 rounded-full"
          alt={post.author.username}
        />
        <span>{post.author.username}</span>
        <span className="text-xs">• {formatDate(post.createdAt)}</span>
      </div>

      {/* Content */}
      <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.mediaUrls.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {post.mediaUrls.slice(0, 3).map((url, i) => {
            const isVideo = url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov");
            if (isVideo) {
              return (
                <video
                  key={i}
                  src={url}
                  controls
                  className="w-40 h-40 object-cover rounded cursor-pointer"
                  onClick={() => window.open(url, "_blank")}
                />
              );
            } else {
              return (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => window.open(url, "_blank")}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
