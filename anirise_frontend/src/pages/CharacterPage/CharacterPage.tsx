import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharacterById } from "../../api/characterApi";
import { CharacterDTO } from "../../api/types/character.types";

import CharacterHeader from "./components/CharacterHeader";
import CharacterBio from "./components/CharacterBio";
import CharacterAnimeList from "./components/CharacterAnimeList";
import CharacterMediaList from "./components/CharacterMediaList";

const CharacterPage = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<CharacterDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getCharacterById(Number(id))
      .then(setCharacter)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center text-white mt-10">Loading...</p>;

  if (!character)
    return <p className="text-center text-red-500 mt-10">Character not found</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 text-white">
      <CharacterHeader character={character} />

      <CharacterBio bio={character.Bio || {}} />

      <CharacterAnimeList animes={character.Animes || []} />

      <CharacterMediaList media={character.Media || []} />
    </div>
  );
};

export default CharacterPage;
