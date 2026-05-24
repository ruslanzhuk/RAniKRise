export interface AnimeShortDTO {
  id: number;
  title: string;
  imageUrl?: string;
}

export interface CollectionDTO {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  animes: AnimeShortDTO[];
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
}

export interface SyncAnimeCollectionsRequest {
  animeId: number;
  collectionIds: number[];
}
