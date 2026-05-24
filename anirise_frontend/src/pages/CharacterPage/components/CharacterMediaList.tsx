import { MediaDTO } from "../../../api/types/character.types";

interface Props {
  media?: MediaDTO[];
}

const CharacterMediaList: React.FC<Props> = ({ media = [] }) => {
  if (!media.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Media
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {media.map((m, i) => (
          <img
            key={i}
            src={m.Url}
            alt={`Media ${i}`}
            className="rounded-lg object-cover w-full h-48
                       shadow-md hover:opacity-90 transition cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterMediaList;
