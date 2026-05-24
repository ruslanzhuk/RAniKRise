import { CharacterDTO } from "../../../api/types/character.types";

interface Props {
  character: CharacterDTO;
}

const CharacterHeader: React.FC<Props> = ({ character }) => {
  const poster = character.Media?.find(m => m.Type === "Image")?.Url;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        {poster ? (
          <img
            src={poster}
            alt={character.Name}
            className="w-48 h-64 object-cover border-2 border-gray-600 shadow-md"
          />
        ) : (
          <div className="w-48 h-64 bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
            <p className="text-gray-500">No Image</p>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-3">{character.Name}</h1>
        {character.Description ? (
          <p className="text-gray-300 leading-relaxed">{character.Description}</p>
        ) : (
          <p className="text-gray-400 italic">No description available</p>
        )}
      </div>
    </div>
  );
};

export default CharacterHeader;
