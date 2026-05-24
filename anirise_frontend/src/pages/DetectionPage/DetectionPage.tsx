import React, { useState } from "react";
import DetectionUpload from "./components/DetectionUpload";
import { CharacterCardDTO } from "../../api/types/ml";
import { detectCharacters } from "../../api/detectionApi";
import { getByCharacter } from "../../api/animeApi";

interface CharacterWithAnime extends CharacterCardDTO {
  animes: { id: number; title: string; imageUrl?: string | null }[];
}

const DetectionPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterWithAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectionAttempted, setDetectionAttempted] = useState(false);

  const handleDetectionComplete = async (results: CharacterCardDTO[]) => {
    setDetectionAttempted(true);

    if (results.length === 0) {
      setCharacters([]);
      setLoading(false);
      return;
    }

    const enriched: CharacterWithAnime[] = [];

    for (const char of results) {
      try {
        const animes = await getByCharacter(char.id);
        enriched.push({ ...char, animes });
      } catch (err) {
        console.error("Error fetching animes for character:", char.name, err);
        enriched.push({ ...char, animes: [] });
      }
    }

    setCharacters(enriched);
    setLoading(false);
  };

  const getConfidenceColor = (value: number) => {
    if (value >= 0.83) return "linear-gradient(to right, #22c55e, #16a34a)";
    if (value >= 0.64) return "linear-gradient(to right, #eab308, #f59e0b)";
    return "linear-gradient(to right, #ef4444, #b91c1c)";
  };

  return (
    <div className="max-w-[1560px] mx-auto px-8 md:px-16 py-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-main">Anime Character Detection</h1>

      <DetectionUpload
        onDetectionStart={() => {
          setLoading(true);
          setDetectionAttempted(false);
          setCharacters([]);
        }}
        onDetectionComplete={handleDetectionComplete}
      />

      {loading && (
        <p className="text-sm text-gray-400 mt-2 animate-pulse">Detection...</p>
      )}

      {!loading && detectionAttempted && characters.length === 0 && (
        <div className="mt-10 p-6 bg-gray-800 rounded-lg text-center text-white">
          <p className="text-lg font-semibold mb-2">
            ⚠️ Our model couldn't detect any characters in this image.
          </p>
          <p className="text-sm text-gray-300">
            Please try uploading a different image or ensure the characters are clearly visible.
          </p>
        </div>
      )}

      {characters.length > 0 && (
        <div className="mt-10 space-y-8">
          {characters.map((char) => (
            <div key={char.id} className="bg-gray-800 p-4 rounded-xl shadow-md">
              {/* Character Info */}
              <div className="flex items-center gap-4 mb-4">
                {char.posterUrl ? (
                  <img
                    src={char.posterUrl}
                    alt={char.name}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-32 flex items-center justify-center bg-gray-700 rounded-lg text-gray-400">
                    No Image
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-bold text-lg">{char.name}</p>
                  <div className="mt-1">
                    <p className="font-bold text-sm text-white mb-1">
                      Confidence: {(char.confidence * 100).toFixed(0)}%
                    </p>
                    <div className="w-full h-3 rounded-full overflow-hidden bg-gray-700 relative">
                      <div
                        className="h-full absolute top-0 left-0"
                        style={{
                          width: `${(char.confidence * 100).toFixed(0)}%`,
                          background: getConfidenceColor(char.confidence),
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anime list */}
              {char.animes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {char.animes.map((anime) => (
                    <a
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="bg-gray-700 rounded-lg overflow-hidden shadow-md hover:scale-105 transition transform"
                      style={{ width: 170, height: 250 }}
                    >
                      {anime.imageUrl ? (
                        <img
                          src={anime.imageUrl}
                          alt={anime.title}
                          className="w-full h-[170px] object-cover"
                        />
                      ) : (
                        <div className="w-full h-[170px] flex items-center justify-center bg-gray-600 text-gray-400">
                          No Image
                        </div>
                      )}

                      <p className="text-sm p-2 text-white font-medium line-clamp-2 h-[70px]">
                        {anime.title}
                      </p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  No anime found for this character
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionPage;