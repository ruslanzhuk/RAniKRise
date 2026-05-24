import defaultPoster from "assets/images/anime_poster_default.png";
import { AnimeShortDTO } from "../../api/types/collection.types";

export default function AnimeCard({ anime }: { anime: AnimeShortDTO }) {
  return (
    <div
      className="bg-gray-800 rounded-xl overflow-hidden shadow-md
                 hover:scale-105 hover:shadow-pink-500/30
                 transition-all duration-300 cursor-pointer"
    >
      <img
        src={anime.imageUrl || defaultPoster}
        alt={anime.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-3 text-center">
        <p className="text-sm font-medium text-white truncate">
          {anime.title}
        </p>
      </div>
    </div>
  );
}
