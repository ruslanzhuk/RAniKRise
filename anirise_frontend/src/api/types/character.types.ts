export interface MediaDTO {
  Url: string;
  Type: string;
}

export interface CharacterAnimeDTO {
  Id: number;
  Title: string;
  Role: string;
  PosterUrl?: string | null;
}

export interface CharacterMiniDTO {
  id: number;
  name: string;
  imageUrl?: string | null;
}

export interface CharacterDTO {
  Id: number;
  MalId: number;
  Name: string;
  Description?: string | null;
  Bio: Record<string, string>;
  Media: MediaDTO[];
  Animes: CharacterAnimeDTO[];
}
