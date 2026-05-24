import React from "react";
import { Link } from "react-router-dom";
import { Anime } from "../api/animeApi";

interface Props {
  animes: Anime[];
}

const UpcomingSlider: React.FC<Props> = ({ animes }) => {
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 py-4 px-2">
      <div className="inline-flex gap-4">
        {animes.map((anime) => (
          <Link
            to={`/anime/${anime.id}`}
            key={anime.id}
            className="w-40 flex-shrink-0 hover:scale-105 transition-transform"
          >
            <div className="relative">
              <img
                src={anime.posterUrl ?? "/placeholder.jpg"}
                alt={anime.title}
                className="w-40 h-56 object-cover rounded-xl shadow-lg"
              />
              {anime.score !== undefined && (
                <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-yellow-400 text-sm font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  ⭐ {anime.score.toFixed(1)}
                </span>
              )}
            </div>
            <p className="text-center mt-2 text-sm font-medium line-clamp-2">
              {anime.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSlider;
