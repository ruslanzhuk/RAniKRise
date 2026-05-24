import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetAnimeById } from "../../../api/adminApi";
import { AdminAnimeDetailsDTO } from "../../../api/types/adminAll.types";

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AdminAnimeDetailsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminGetAnimeById(Number(id))
      .then(setAnime)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!anime) return <p>Anime not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>

      <p><strong>Japanese title:</strong> {anime.japaneseTitle ?? "—"}</p>
      <p><strong>Description:</strong> {anime.description}</p>
      <p><strong>Episodes:</strong> {anime.episodes}</p>
      <p><strong>Status:</strong> {anime.status}</p>
      <p><strong>Type:</strong> {anime.type}</p>
      <p><strong>Age Rating:</strong> {anime.ageRating ?? "—"}</p>
      <p><strong>Average Score:</strong> {anime.averageScore}</p>
      <p><strong>Scored By:</strong> {anime.scoredBy ?? "N/A"}</p>
      <p><strong>Rank:</strong> {anime.rank ?? "N/A"}</p>
      <p>
        <strong>Release Date:</strong>{" "}
        {new Date(anime.releaseDate).toLocaleDateString()}
      </p>

      <hr className="my-4" />

      <p>
        <strong>Genres IDs:</strong>{" "}
        {anime.genreIds.length ? anime.genreIds.join(", ") : "—"}
      </p>

      <p>
        <strong>Studios IDs:</strong>{" "}
        {anime.studioIds.length ? anime.studioIds.join(", ") : "—"}
      </p>

      <div className="mt-2">
        <strong>Authors:</strong>
        {anime.authors.length === 0 ? (
          <p className="ml-2">—</p>
        ) : (
          <ul className="ml-4 list-disc">
            {anime.authors.map((a) => (
              <li key={a.authorId}>
                ID: {a.authorId}, Role: {a.role}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2">
        <strong>Characters:</strong>
        {anime.characters.length === 0 ? (
          <p className="ml-2">—</p>
        ) : (
          <ul className="ml-4 list-disc">
            {anime.characters.map((c) => (
              <li key={c.characterId}>
                ID: {c.characterId}, Role: {c.role}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="mt-6 bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
        onClick={() => navigate(`/xkey/broadmin/anime/${anime.id}/edit`)}
      >
        Edit
      </button>
    </div>
  );
};

export default AnimeDetailPage;
