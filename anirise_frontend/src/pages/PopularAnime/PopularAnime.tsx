import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getPopularAnime, Anime } from "../../api/animeApi";
import { Link } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AnimePreview {
  id: number;
  title: string;
  posterUrl?: string;
  type?: string;
  year?: number;
  score?: number;
}

const PAGE_SIZE = 18;

const PopularAnime: React.FC = () => {
  const [popular, setPopular] = useState<Anime[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopular = async (pageNumber: number) => {
    setLoading(true);

    try {
      const newAnime = await getPopularAnime(
        PAGE_SIZE,
        pageNumber * PAGE_SIZE
      );

      if (newAnime.length === 0) {
        setHasMore(false);
        return;
      }

      setPopular(prev => [...prev, ...newAnime]);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchPopular(0);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPopular(nextPage);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/images/anime-bg1.jpg)" }}
    >
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Popular Anime
        </h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {popular.map((anime) => (
            <Link
              key={anime.id}
              to={`/anime/${anime.id}`}
              className="block h-full"
            >
              <div
                className="
                  h-[340px]
                  bg-white/10 backdrop-blur-sm
                  rounded-xl shadow-lg
                  overflow-hidden
                  flex flex-col
                  hover:scale-105
                  transition-transform
                  duration-200
                  cursor-pointer
                "
              >
                {/* POSTER */}
                <div className="h-[240px] w-full bg-gray-700">
                  {anime.posterUrl ? (
                    <img
                      src={anime.posterUrl}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex flex-col flex-grow p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 text-center">
                    {anime.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 text-center mt-1">
                    {anime.type || "Unknown"}
                  </p>

                  {/* YEAR + SCORE */}
                  <div className="mt-auto flex items-center justify-between text-[11px] text-gray-400">
                    <span>{anime.year || "N/A"}</span>
                    <span className="text-yellow-400 font-medium">
                      ⭐ {anime.score?.toFixed(1) ?? "N/A"}
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
            <div className="text-gray-300 text-lg">Loading...</div>
          ) : hasMore ? (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            >
              Load more
            </button>
          ) : (
            <div className="text-gray-400">No more anime to load</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularAnime;