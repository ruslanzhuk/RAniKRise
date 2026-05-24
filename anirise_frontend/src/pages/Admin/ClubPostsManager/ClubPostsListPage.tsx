import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetClubPosts,
  adminDeleteClubPost,
  adminGetClubById,
} from "../../../api/adminApi";
import { ClubPostDTO, ClubDetailDTO } from "../../../api/types/adminAll.types";

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>?/gm, "").slice(0, 120);

const ClubPostsListPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<ClubDetailDTO | null>(null);
  const [posts, setPosts] = useState<ClubPostDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) return;

    const load = async () => {
      try {
        const [clubData, postsData] = await Promise.all([
          adminGetClubById(Number(clubId)),
          adminGetClubPosts(Number(clubId)),
        ]);

        setClub(clubData);
        setPosts(postsData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [clubId]);

  const handleDelete = async (postId: number) => {
    if (!window.confirm("Delete this post?")) return;
    await adminDeleteClubPost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) return <p>Loading...</p>;
  if (!club) return <p>Club not found</p>;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">
          Posts – {club.name}
        </h1>
        <p className="text-gray-600">
          Manage club posts
        </p>
      </div>

      {/* Actions */}
      <div className="mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() =>
            navigate(`/xkey/broadmin/posts/clubs/${club.id}/create`)
          }
        >
          Create post
        </button>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Content</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Stats</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="border p-2">{post.id}</td>

                <td className="border p-2 text-sm">
                  {stripHtml(post.content)}…
                </td>

                <td className="border p-2">
                  {post.authorUsername}
                </td>

                <td className="border p-2 text-sm">
                  👍 {post.likes} | 👎 {post.dislikes}
                  <br />
                  💬 {post.commentsCount}
                </td>

                <td className="border p-2 text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </td>

                <td className="border p-2 flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      navigate(
                        `/xkey/broadmin/posts/${post.id}`
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    className="text-yellow-600 hover:underline"
                    onClick={() =>
                      navigate(
                        `/xkey/broadmin/posts/${post.id}/edit`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ClubPostsListPage;
