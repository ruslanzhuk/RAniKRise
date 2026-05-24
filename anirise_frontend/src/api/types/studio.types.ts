/* =========================
   DTO TYPES
========================= */

export interface StudioMiniDTO {
  id: number;
  name: string;
  posterUrl?: string | null;
  animeCount: number;
}

export interface StudioAnimeDTO {
  id: number;
  title: string;
}

export interface MediaDTO {
  url: string;
  type: string;
}

export interface StudioDTO {
  id: number;
  name: string;
  description?: string | null;
  media: MediaDTO[];
  animes: StudioAnimeDTO[];
}