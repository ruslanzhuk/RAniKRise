import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentlyAiringAnime, Anime } from "../../api/animeApi";

const PAGE_SIZE = 18;

const AiringAnime: React.FC = () => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAiring = async (pageNumber: number) => {
    setLoading(true);

    const offset = pageNumber * PAGE_SIZE;
    const newAnime = await getCurrentlyAiringAnime(PAGE_SIZE, offset);

    if (newAnime.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setAnime(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const unique = newAnime.filter(a => !existingIds.has(a.id));
      return [...prev, ...unique];
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchAiring(0);
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchAiring(next);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/images/anime-bg1.jpg)" }}
    >
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Currently Airing Anime
        </h1>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {anime.map(a => (
            <Link key={a.id} to={`/anime/${a.id}`}>
              <div className="h-[360px] flex flex-col bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
                {a.posterUrl ? (
                  <img
                    src={a.posterUrl}
                    alt={a.title}
                    className="w-full h-[220px] object-cover"
                  />
                ) : (
                  <div className="h-[220px] bg-gray-700 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="flex flex-col flex-grow p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 text-center">
                    {a.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 text-center mt-1">
                    {a.type}
                  </p>

                  <div className="mt-auto flex justify-between text-[11px] text-gray-400">
                    <span>{a.year ?? "N/A"}</span>
                    <span className="text-yellow-400 font-medium">
                      ⭐ {a.score?.toFixed(1) ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* LOAD MORE */}
        <div className="flex justify-center mt-10">
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : hasMore ? (
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Load more
            </button>
          ) : (
            <span className="text-gray-400">No more anime</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiringAnime;
