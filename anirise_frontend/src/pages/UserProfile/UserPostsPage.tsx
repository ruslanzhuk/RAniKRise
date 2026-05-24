import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postApi } from "../../api/postApi";
import type { PostResponseDTO } from "../../api/types/post.types";
import defaultAvatar from "assets/images/default_avatar_7665.png";
import { getPublicProfileByUsername, PublicProfile } from "../../api/animeApi";

export default function UserPostsPage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const load = async () => {
      try {
        const userProfile = await getPublicProfileByUsername(username);
        setProfile(userProfile);

        const userPosts = await postApi.getUserPosts(userProfile.id);
        setPosts(userPosts);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Loading posts…</div>;
  }

  if (!profile) {
    return <div className="text-center text-red-400 py-20">User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All posts</h1>

        <Link
          to={`/user/${profile.username}`}
          className="text-sm text-purple-400 hover:underline"
        >
          ← Back to profile
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">This user has no posts yet</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: PostResponseDTO }) {
  return (
    <div className="bg-gray-900 p-5 rounded-xl space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <img
          src={post.author.avatarUrl || defaultAvatar}
          alt={post.author.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{post.author.username}</span>
        <span className="text-xs">• {formatDate(post.createdAt)}</span>
      </div>

      <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>

      {post.mediaUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.mediaUrls.map((url, i) => (
            <img key={i} src={url} alt="" className="w-32 h-32 object-cover rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
