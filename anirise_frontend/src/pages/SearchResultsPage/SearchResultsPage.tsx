import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchAll, SearchResultDTO } from "../../api/animeApi";

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const type = params.get("type") || "all";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResultDTO | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await searchAll(type, query);
      setResults(data);
      setLoading(false);
    };

    load();
  }, [query, type]);

  if (loading)
    return <p className="text-center text-white mt-10">Loading...</p>;

  if (!results)
    return <p className="text-center text-red-500 mt-10">Error loading results.</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-purple-400">{query}</span>
      </h1>

      {/* === ANIME === */}
      {results.animes && results.animes.length > 0 && (
        <Section title="Anime">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.animes.map(anime => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition"
              >
                <img
                  src={anime.posterUrl || "/placeholder.png"}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="font-semibold mt-2">{anime.title}</p>
                {anime.rating !== null && (
                  <p className="text-sm text-gray-400">{anime.rating}/10</p>
                )}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* === CHARACTERS === */}
      {results.characters && results.characters.length > 0 && (
        <Section title="Characters">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {results.characters.map(char => (
              <Link
                key={char.id}
                to={`/industry/characters/${char.id}`}
                className="text-center"
              >
                <img
                  src={char.imageUrl || "/placeholder.png"}
                  className="w-full h-32 object-cover rounded"
                />
                <p>{char.name}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* === USERS === */}
      {results.users && results.users.length > 0 && (
        <Section title="Users">
          <div className="grid grid-cols-1 gap-3">
            {results.users.map(u => (
              <Link
                key={u.id}
                to={`/user/${u.username}`}
                className="flex items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700"
              >
                <img
                  src={u.avatarUrl || "/placeholder.png"}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <p className="text-lg">{u.username}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {results.clubs && results.clubs.length > 0 && (
        <Section title="Clubs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.clubs.map(club => (
              <Link
                key={club.id}
                to={`/clubs/${club.id}`}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
              >
                <h3 className="text-xl font-semibold">{club.name}</h3>
                <p className="text-gray-400 text-sm">{club.description}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* === STUDIOS === */}
      {results.studios && results.studios.length > 0 && (
        <Section title="Studios">
          <ul className="space-y-3">
            {results.studios.map(s => (
              <Link
                key={s.id}
                to={`/studios/${s.id}`}
                className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
              >
                <p className="text-xl">{s.name}</p>
                <p className="text-gray-400">{s.animeCount} anime</p>
              </Link>
            ))}
          </ul>
        </Section>
      )}

      {/* === AUTHORS === */}
      {results.authors && results.authors.length > 0 && (
        <Section title="Authors">
          <ul className="space-y-3">
            {results.authors.map(a => (
              <Link
                key={a.id}
                to={`/authors/${a.id}`}
                className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
              >
                <p className="text-xl">{a.fullName}</p>
              </Link>
            ))}
          </ul>
        </Section>
      )}

    </div>
  );
};

// Reusable section component
const Section = ({ title, children }: any) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">{title}</h2>
    {children}
  </div>
);

export default SearchResultsPage;
