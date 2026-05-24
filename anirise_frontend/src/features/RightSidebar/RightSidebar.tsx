import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAnime from "../../hooks/useAnime";

const RightSidebar: React.FC = () => {
  const { user } = useAuth();

  const { data: airing, loading: loadingAiring } = useAnime("airing", 3);
  const { data: upcoming, loading: loadingUpcoming } = useAnime("upcoming", 3);

  if (!user) return null;

  return (
    <aside className="fixed right-0 top-16 w-80 h-full bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto z-30">
      {/* STATYSTYKA UŻYTKOWNIKA */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Twoja Statystyka</h3>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-gray-400">Obejrzane:</span>
            <span className="float-right font-bold text-green-400">124</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-gray-400">Oglądam:</span>
            <span className="float-right font-bold text-blue-400">12</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-gray-400">Planuję:</span>
            <span className="float-right font-bold text-yellow-400">45</span>
          </div>
        </div>
      </div>

      {/* TOP 3 AIRING */}
        <div className="mb-8">
        <h3 className="text-lg font-bold text-green-400 mb-3">Top Airing</h3>
        {loadingAiring ? (
          <p className="text-sm text-gray-400">Ładowanie...</p>
        ) : !airing || airing.length === 0 ? (
          <p className="text-sm text-gray-500">Brak danych</p>
        ) : (
          airing.map((anime) => (
            <Link key={anime.id} to={`/anime/${anime.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition mb-2">
              <img
                src={anime.posterUrl ?? "https://via.placeholder.com/48x64?text=No+Image"}
                alt={anime.title ?? "No title"}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">{anime.title ?? "No title"}</p>
                <p className="text-xs text-green-400">★ {anime.score ?? "N/A"}</p>
              </div>
            </Link>
          ))
        )}
        </div>

        {/* TOP 3 UPCOMING */}
        <div>
        <h3 className="text-lg font-bold text-yellow-400 mb-3">Top Upcoming</h3>
        {loadingUpcoming ? (
            <p className="text-sm text-gray-400">Ładowanie...</p>
        ) : (
            upcoming?.map((anime) => (
            <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition mb-2"
            >
                <img
                src={anime.posterUrl || "https://via.placeholder.com/48x64?text=No+Image"}
                alt={anime.title}
                className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">{anime.title}</p>
                <p className="text-xs text-yellow-400">★ {anime.score || "N/A"}</p>
                </div>
            </Link>
            )) || <p className="text-sm text-gray-500">Brak danych</p>
        )}
        </div>
    </aside>
  );
};

export default RightSidebar;