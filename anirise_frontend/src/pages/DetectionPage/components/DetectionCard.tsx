import { Link } from "react-router-dom";
import { CharacterCardDTO } from "../../../api/types/ml";

interface DetectionCardProps {
  character: CharacterCardDTO;
}

const DetectionCard: React.FC<DetectionCardProps> = ({ character }) => {
  return (
    <Link
      to={`/industry/characters/${character.id}`}
      className="relative bg-gray-800 rounded-xl overflow-hidden shadow-md
                 hover:scale-105 transform transition duration-300 cursor-pointer block"
    >
      {character.posterUrl ? (
        <img
          src={character.posterUrl}
          alt={character.name}
          className="w-full"
          style={{ aspectRatio: "0.8 / 1" }}
        />
      ) : (
        <div
          className="w-full flex items-center justify-center text-gray-500"
          style={{ aspectRatio: "0.8 / 1", backgroundColor: "#2d2d2d" }}
        >
          No Image
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-center py-1">
        <p className="font-medium text-sm text-white">{character.name}</p>
        <p className="text-xs text-gray-300">
          Confidence: {(character.confidence * 100).toFixed(0)}%
        </p>
      </div>
    </Link>
  );
};

export default DetectionCard;