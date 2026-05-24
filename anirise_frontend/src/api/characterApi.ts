import http from "./http";
import { CharacterDTO, MediaDTO, CharacterAnimeDTO, CharacterMiniDTO } from "./types/character.types";

interface CharacterApiResponse {
  id: number;
  malId: number;
  name: string;
  description: string | null;
  bio: Record<string, string>;
  media: { url: string; type: string }[];
  animes: { id: number; title: string; role: string; posterUrl?: string | null }[];
}

export const getCharacterById = async (id: number): Promise<CharacterDTO> => {
  const response = await http.get<CharacterApiResponse>(`/character/${id}`);
  const data = response.data;

  const character: CharacterDTO = {
    Id: data.id,
    MalId: data.malId,
    Name: data.name,
    Description: data.description,
    Bio: data.bio || {},
    Media: (data.media || []).map<MediaDTO>(m => ({
      Url: m.url,
      Type: m.type === "Character_poster" ? "Image" : m.type
    })),
    Animes: (data.animes || []).map<CharacterAnimeDTO>(a => ({
      Id: a.id,
      Title: a.title,
      Role: a.role,
      PosterUrl: a.posterUrl || null
    }))
  };

  return character;
};

export const getCharacters = async (
  page = 1,
  pageSize = 20,
  search?: string
): Promise<CharacterDTO[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) params.append("search", search);

  const response = await http.get<any[]>(`/character?${params}`);
  const data = response.data;

  return (data || []).map((d: any) => ({
    Id: d.id as number,
    MalId: d.malId as number,
    Name: d.name as string,
    Description: d.description as string | null,
    Bio: (d.bio || {}) as Record<string, string>,
    Media: ((d.media || []) as { url: string; type: string }[]).map((m: { url: string; type: string }) => ({
      Url: m.url,
      Type: m.type === "Character_poster" ? "Image" : m.type
    })),
    Animes: ((d.animes || []) as { id: number; title: string; role: string; posterUrl?: string | null }[]).map((a: { id: number; title: string; role: string; posterUrl?: string | null }) => ({
      Id: a.id,
      Title: a.title,
      Role: a.role,
      PosterUrl: a.posterUrl || null
    }))
  }));
};


// GET /character/alphabet
export const getCharacterAlphabetCounts = async (): Promise<Record<string, number>> => {
  const response = await http.get<Record<string, number>>("/character/alphabet");
  return response.data;
};

export const getCharactersByLetter = async (
  letter: string,
  page = 1,
  pageSize = 20
): Promise<CharacterDTO[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  const response = await http.get<any[]>(`/character/letter/${letter}?${params}`);
  const data = response.data;

  return (data || []).map((d: any) => ({
    Id: d.id as number,
    MalId: d.malId as number,
    Name: d.name as string,
    Description: d.description as string | null,
    Bio: (d.bio || {}) as Record<string, string>,
    Media: ((d.media || []) as { url: string; type: string }[]).map((m: { url: string; type: string }) => ({
      Url: m.url,
      Type: m.type === "Character_poster" ? "Image" : m.type
    })),
    Animes: ((d.animes || []) as { id: number; title: string; role: string; posterUrl?: string | null }[]).map((a: { id: number; title: string; role: string; posterUrl?: string | null }) => ({
      Id: a.id,
      Title: a.title,
      Role: a.role,
      PosterUrl: a.posterUrl || null
    }))
  }));
};


export const getCharactersByAnime = async (animeId: number) => {
  const response = await http.get<{
    mainCharacters: CharacterMiniDTO[];
    supportingCharacters: CharacterMiniDTO[];
  }>(`/character/anime/${animeId}`);

  console.log("RAW API RESPONSE:", response.data);

  return response.data;
};