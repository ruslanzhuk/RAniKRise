import React, { useEffect, useState } from "react";
import { getCharacters, getCharacterAlphabetCounts, getCharactersByLetter } from "../../api/characterApi";
import { CharacterDTO } from "../../api/types/character.types";
import { Link } from "react-router-dom";

const PAGE_SIZE = 20;

const CharactersSearchPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  const [alphabet, setAlphabet] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlphabet = async () => {
      const counts = await getCharacterAlphabetCounts();
      setAlphabet(counts);
    };
    fetchAlphabet();
  }, []);

  const fetchCharacters = async (newPage: number, searchTerm?: string, letter?: string) => {
    setLoading(true);

    let data: CharacterDTO[] = [];

    if (letter) {
      data = await getCharactersByLetter(letter, newPage, PAGE_SIZE);
    } else if (searchTerm) {
      data = await getCharacters(newPage, PAGE_SIZE, searchTerm);
    } else {
      data = await getCharacters(newPage, PAGE_SIZE);
    }

    if (data.length < PAGE_SIZE) setHasMore(false);

    setCharacters(prev => (newPage === 1 ? data : [...prev, ...data]));
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    setActiveLetter(null);
    fetchCharacters(1, search.trim() || undefined);
  };

  const handleLetterClick = (letter: string) => {
    setPage(1);
    setHasMore(true);
    setActiveLetter(letter);
    setSearch("");
    fetchCharacters(1, undefined, letter);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchCharacters(next, activeLetter ? undefined : search || undefined, activeLetter || undefined);
  };

  const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Characters</h1>

      {/* SEARCH INPUT */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search characters..."
          className="px-4 py-2 rounded-l-lg border border-gray-600 bg-gray-800 text-white w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded-r-lg bg-purple-600 hover:bg-purple-700 text-white"
        >
          Search
        </button>
      </div>

      {/* ALPHABET TABLE */}
      {!search && !activeLetter && (
        <div className="grid grid-cols-4 gap-4 mb-6 text-center">
          {alphabetLetters.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className="bg-gray-700 hover:bg-purple-600 rounded-lg py-6 flex flex-col justify-center items-center text-white font-bold text-xl transition"
            >
              <span>{letter}</span>
              <span className="mt-2 text-sm border-t border-gray-400 pt-1">
                {alphabet[letter] || 0}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* CHARACTER GRID */}
      {characters.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {characters.map(c => (
            <Link key={c.Id} to={`/industry/characters/${c.Id}`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
                {c.Media?.[0]?.Url ? (
                  <img src={c.Media[0].Url} alt={c.Name} className="w-full h-60 object-cover" />
                ) : (
                  <div className="w-full h-60 bg-gray-700 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-3 text-center text-white">
                  <h3 className="font-semibold text-md line-clamp-2">{c.Name}</h3>
                  <p className="text-gray-400 text-sm">{c.Description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* LOAD MORE */}
      {characters.length > 0 && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Load More
          </button>
        </div>
      )}

      {loading && <p className="text-center text-gray-300 mt-4">Loading...</p>}
    </div>
  );
};

export default CharactersSearchPage;
