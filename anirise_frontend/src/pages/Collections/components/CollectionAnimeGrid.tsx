import { Link } from "react-router-dom";
import { AnimeShortDTO } from "../../../api/types/collection.types";
import notFound from "../../../assets/images/not_found.png";

interface Props {
  animes: AnimeShortDTO[];
  onRemove?: (animeId: number) => void;
}

const CollectionAnimeGrid: React.FC<Props> = ({ animes, onRemove }) => {
  if (animes.length === 0) {
    return <p className="text-gray-400">No anime in this collection.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {animes.map(anime => (
        <div key={anime.id} className="relative group">
          <Link to={`/anime/${anime.id}`}>
            <img
              src={anime.imageUrl || notFound}
              alt={anime.title}
              className="w-full h-56 object-cover rounded-lg"
            />
          </Link>

          {onRemove && (
            <button
              onClick={() => onRemove(anime.id)}
              className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Remove
            </button>
          )}

          <p className="text-sm text-center text-gray-300 mt-1 truncate">
            {anime.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CollectionAnimeGrid;
