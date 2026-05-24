import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetAnimes, adminDeleteAnime } from "../../../api/adminApi";
import { AdminAnimeListItemDTO } from "../../../api/types/adminAll.types";

const AnimeListPage = () => {
  const [animes, setAnimes] = useState<AdminAnimeListItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); 
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const loadAnimes = useCallback(async () => {
    setLoading(true);
    try {
      const { items, totalCount } = await adminGetAnimes({
        page: page - 1,
        limit,
      });

      setAnimes(items);
      setTotal(totalCount);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadAnimes();
  }, [loadAnimes]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete anime?")) return;

    await adminDeleteAnime(id);

    if (animes.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      await loadAnimes();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Anime List</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => navigate("/xkey/broadmin/anime/import")}
            disabled={loading}
            title="Import anime directly from MyAnimeList via Jikan API"
          >
            Import from Jikan
          </button>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={() => navigate("/xkey/broadmin/anime/create")}
          >
            Create New Anime
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded bg-white shadow-sm">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">ID</th>
                <th className="px-3 py-2 border">Title</th>
                <th className="px-3 py-2 border">JP</th>
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Age</th>
                <th className="px-3 py-2 border">Score</th>
                <th className="px-3 py-2 border">Episodes</th>
                <th className="px-3 py-2 border">Rank</th>
                <th className="px-3 py-2 border">Release</th>
                <th className="px-3 py-2 border">Links</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {animes.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{a.id}</td>
                  <td className="px-3 py-2 border font-medium text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`/xkey/broadmin/anime/${a.id}`)}>
                        {a.title}
                  </td>
                  <td className="px-3 py-2 border text-gray-500">
                    {a.japaneseTitle ?? "—"}
                  </td>
                  <td className="px-3 py-2 border">{a.type}</td>
                  <td className="px-3 py-2 border">{a.status}</td>
                  <td className="px-3 py-2 border">{a.ageRating ?? "—"}</td>
                  <td className="px-3 py-2 border">{a.averageScore}</td>
                  <td className="px-3 py-2 border">{a.episodes}</td>
                  <td className="px-3 py-2 border">{a.rank ?? "—"}</td>
                  <td className="px-3 py-2 border">
                    {new Date(a.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border text-xs">
                    G:{a.genresCount} / S:{a.studiosCount} / A:{a.authorsCount}
                  </td>
                  <td className="px-3 py-2 border flex gap-2">
                    <button
                      className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
                      onClick={() =>
                        navigate(`/xkey/broadmin/anime/${a.id}/edit`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600 transition"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {animes.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    No animes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            className="px-3 py-1 border rounded bg-white hover:bg-gray-100 transition disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-3 py-1 border rounded bg-white hover:bg-gray-100 transition disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeListPage;
