import { useNavigate } from "react-router-dom";
import { CharacterAnimeDTO } from "../../../api/types/character.types";

interface Props {
  animes?: CharacterAnimeDTO[];
}

const CharacterAnimeList: React.FC<Props> = ({ animes = [] }) => {
  const navigate = useNavigate();
  if (!animes.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
        Appears In
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {animes.map(a => (
          <div
            key={a.Id}
            onClick={() => navigate(`/anime/${a.Id}`)}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-md
                       hover:scale-105 transition cursor-pointer"
          >
            {a.PosterUrl ? (
              <img
                src={a.PosterUrl}
                alt={a.Title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No Image</p>
              </div>
            )}

            <div className="p-2 text-center">
              <p className="font-medium text-sm">{a.Title}</p>
              <p className="text-xs text-gray-400">{a.Role || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterAnimeList;
