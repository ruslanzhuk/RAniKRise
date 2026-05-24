import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAuthorById } from "../../api/authorApi";
import { AuthorDTO, AuthorAnimeDTO } from "../../api/types/author.types";
import notFoundPoster from "../../assets/images/not_found.png";

const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<AuthorDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getAuthorById(Number(id))
      .then(setAuthor)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;
  if (!author) return <p className="text-center text-red-500 mt-10">Author not found</p>;

  const avatar = author.media.find(m => m.type === "Author_poster")?.url || notFoundPoster;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <img src={avatar} alt={author.name} className="w-48 h-48 object-cover rounded-xl border-2 border-gray-600" />
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white">{author.name}</h1>
          <p className="text-gray-300 mt-2">{author.bio || "Bio not available."}</p>
        </div>
      </div>

      {/* Anime list */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">Anime Works</h2>
        {author.animes.length === 0 ? (
          <p className="text-gray-400">No anime found for this author.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {author.animes.map((anime: AuthorAnimeDTO) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
              >
                <img
                  src={anime.posterUrl || "/assets/images/not_found.png"}
                  alt={anime.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 text-center">
                  <h3 className="text-white font-medium">{anime.title}</h3>
                  {anime.roles.length > 0 && (
                    <p className="text-gray-400 text-sm mt-1 truncate">{anime.roles.join(", ")}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
