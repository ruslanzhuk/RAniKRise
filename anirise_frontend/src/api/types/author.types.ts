export interface AuthorDTO {
  id: number;
  name: string;
  bio?: string;
  media: MediaDTO[];
  animes: AuthorAnimeDTO[];
}

export interface AuthorAnimeDTO {
  id: number;
  title: string;
  roles: string[];
  posterUrl?: string;
}

export interface MediaDTO {
  url: string;
  type: string;
}
