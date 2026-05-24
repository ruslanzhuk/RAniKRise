import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAuthorsByAnime } from "../../api/authorApi";
import { AuthorDTO } from "../../api/types/author.types";

import notFoundPoster from "../../assets/images/not_found.png";

const AuthorsByAnimePage: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) return;

    getAuthorsByAnime(Number(animeId))
      .then(setAuthors)
      .finally(() => setLoading(false));
  }, [animeId]);

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;
  if (!authors.length)
    return <p className="text-center text-gray-400 mt-10">No authors found for this anime.</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">Authors of this Anime</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {authors.map(author => {
          const poster = author.media.find(m => m.type === "Author_poster")?.url || notFoundPoster;

          return (
            <Link
              to={`/industry/authors/${author.id}`}
              key={author.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:scale-105 transform transition duration-300 cursor-pointer"
            >
              <img src={poster} alt={author.name} className="w-full h-48 object-cover" />
              <div className="p-2 text-center">
                <h3 className="text-white font-medium">{author.name}</h3>
                {author.bio && <p className="text-gray-400 text-sm mt-1 truncate">{author.bio}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AuthorsByAnimePage;
