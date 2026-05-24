import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharactersByAnime } from "../../api/characterApi";
import { CharacterMiniDTO } from "../../api/types/character.types";
import { Link } from "react-router-dom";
import "../../index.css";

const PAGE_SIZE = 24;

const groupByFirstLetter = (chars: CharacterMiniDTO[]) => {
  return chars.reduce<Record<string, CharacterMiniDTO[]>>((acc, char) => {
    const letter = char.name[0]?.toUpperCase() ?? "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(char);
    return acc;
  }, {});
};

const AnimeCharactersPage = () => {
  const { animeId } = useParams<{ animeId: string }>();

  const [allCharacters, setAllCharacters] = useState<CharacterMiniDTO[]>([]);
  const [activeLetter, setActiveLetter] = useState<string>("A");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) return;

    const fetch = async () => {
      try {
        const data = await getCharactersByAnime(Number(animeId));
        const merged = [...(data.mainCharacters ?? []), ...(data.supportingCharacters ?? [])];
        merged.sort((a, b) => a.name.localeCompare(b.name));
        setAllCharacters(merged);
      } catch (e) {
        console.error("Failed to load characters", e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [animeId]);

  const grouped = useMemo(() => groupByFirstLetter(allCharacters), [allCharacters]);
  const letters = Object.keys(grouped).sort();
  const currentCharacters = grouped[activeLetter] ?? [];

  const totalPages = Math.ceil(currentCharacters.length / PAGE_SIZE);
  const pagedCharacters = currentCharacters.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [activeLetter]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Characters</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLetter(l)}
            style={{
              fontWeight: l === activeLetter ? "bold" : "normal",
              padding: "4px 8px",
              borderRadius: 4,
              cursor: "pointer",
              border: "1px solid #444",
              backgroundColor: l === activeLetter ? "#555" : "#222",
              color: "#eee",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="character-grid">
        {pagedCharacters.map((char) => (
          <Link key={char.id} to={`/industry/characters/${char.id}`} className="character-card-link">
            <div className="character-card">
              <img src={char.imageUrl || "/placeholder.png"} alt={char.name} loading="lazy" />
              <p className="character-card-name">{char.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AnimeCharactersPage;
