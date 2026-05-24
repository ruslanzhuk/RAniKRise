import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetClubPostById,
  adminDeleteClubPost,
} from "../../../api/adminApi";
import { ClubPostDTO } from "../../../api/types/adminAll.types";

const ClubPostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<ClubPostDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const load = async () => {
      try {
        const data = await adminGetClubPostById(Number(postId));
        setPost(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [postId]);

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm("Delete this post?")) return;

    await adminDeleteClubPost(post.id);
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">
          Club Post #{post.id}
        </h1>
        <p className="text-gray-600">
          By {post.authorUsername} ·{" "}
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <button
          className="px-4 py-2 bg-yellow-500 rounded text-white hover:bg-yellow-600"
          onClick={() =>
            navigate(`/xkey/broadmin/posts/${post.id}/edit`)
          }
        >
          Edit
        </button>

        <button
          className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* Content (HTML from DB) */}
      <div className="bg-white p-6 rounded border mb-6">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Media */}
      {post.mediaUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {post.mediaUrls.map((url, idx) => {
            if (url.endsWith(".mp4") || url.includes("video")) {
              return (
                <video
                  key={idx}
                  src={url}
                  controls
                  className="w-full rounded"
                />
              );
            }

            return (
              <img
                key={idx}
                src={url}
                alt="Post media"
                className="w-full rounded"
              />
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-sm text-gray-700">
        👍 {post.likes} · 👎 {post.dislikes} · 💬{" "}
        {post.commentsCount}
      </div>
    </>
  );
};

export default ClubPostDetailPage;
