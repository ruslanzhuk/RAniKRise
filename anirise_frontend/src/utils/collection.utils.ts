import { CollectionDTO } from "../api/types/collection.types";

export const isAnimeInCollection = (
  collection: CollectionDTO,
  animeId: number
): boolean => {
  return collection.animes.some(a => a.id === animeId);
};
