import http from "./http";
import { CollectionDTO, CreateCollectionRequest, AnimeShortDTO, SyncAnimeCollectionsRequest } from "./types/collection.types";

const collectionApi = {
  create: async (data: CreateCollectionRequest): Promise<CollectionDTO> => {
    const res = await http.post<CollectionDTO>("/collections", data);
    return res.data;
  },

  getMyCollections: async (): Promise<CollectionDTO[]> => {
    const res = await http.get<CollectionDTO[]>("/collections/my");
    return res.data;
  },

  getFavorites: async (): Promise<CollectionDTO> => {
    const res = await http.get<CollectionDTO>("/collections/favorites");
    return res.data;
  },

  getUserCollections: async (userId: string): Promise<CollectionDTO[]> => {
    const res = await http.get<CollectionDTO[]>(`/collections/user/${userId}`);
    return res.data;
  },

  addAnime: async (collectionId: number, animeId: number): Promise<void> => {
    await http.post(`/collections/${collectionId}/anime/${animeId}`);
  },

  removeAnime: async (collectionId: number, animeId: number): Promise<void> => {
    await http.delete(`/collections/${collectionId}/anime/${animeId}`);
  },

  deleteCollection: async (collectionId: number): Promise<void> => {
    await http.delete(`/collections/${collectionId}`);
  },

  syncAnime: async (data: SyncAnimeCollectionsRequest): Promise<void> => {
    await http.post("/collections/sync-anime", data);
  },
};

export default collectionApi;
