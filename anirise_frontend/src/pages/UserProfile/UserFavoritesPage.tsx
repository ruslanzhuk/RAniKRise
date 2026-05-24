import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import collectionApi from "../../api/collectionApi";
import { CollectionDTO } from "../../api/types/collection.types";
import defaultAnimePoster from "assets/images/anime_poster_default.png";

export default function UserFavoritesPage() {
  const { userId } = useParams<{ userId: string }>();
  const [favorites, setFavorites] = useState<CollectionDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectionApi
      .getFavorites()
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading favorites…
      </div>
    );
  }

  if (!favorites || favorites.animes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-4">Favorite Anime</h1>
        <p className="text-gray-500">
          You don’t have favorite anime yet.
        </p>
        <Link
          to="/anime"
          className="inline-block mt-3 text-pink-400 hover:underline"
        >
          Discover anime →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Favorite Anime</h1>

        <span className="text-sm bg-pink-600/20 text-pink-400 px-3 py-1 rounded-full">
          {favorites.animes.length}
        </span>
      </div>

      {/* MINI STATS */}
      <p className="text-sm text-gray-500">
        ❤️ {favorites.animes.length} anime added with love
      </p>

      {/* LIST */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {favorites.animes.map((anime) => (
          <Link
            key={anime.id}
            to={`/anime/${anime.id}`}
            className="group relative"
          >
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.03] transition shadow">
              <img
                src={anime.imageUrl || defaultAnimePoster}
                alt={anime.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                         px-2 py-1 rounded text-xs bg-black text-white
                         opacity-0 group-hover:opacity-100 transition
                         pointer-events-none whitespace-nowrap z-10"
            >
              {anime.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
