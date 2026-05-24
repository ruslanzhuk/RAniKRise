import { Link } from "react-router-dom";
import { CollectionDTO } from "../../../api/types/collection.types";

interface Props {
  collection: CollectionDTO;
  isFavorites?: boolean;
}

const CollectionCard: React.FC<Props> = ({ collection, isFavorites }) => {
  return (
    <Link
      to={`/collections/${collection.id}`}
      className="bg-zinc-900 rounded-xl p-4 hover:ring-2 hover:ring-blue-500 transition block"
    >
      <h3 className="text-lg font-semibold text-white">
        {isFavorites ? "❤️ Favorites" : collection.name}
      </h3>

      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
        {collection.description || "No description"}
      </p>

      <p className="text-xs text-gray-500 mt-3">
        {collection.animes.length} anime
      </p>
    </Link>
  );
};

export default CollectionCard;
