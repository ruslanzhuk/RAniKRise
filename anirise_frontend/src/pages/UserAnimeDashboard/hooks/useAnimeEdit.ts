import { useCallback } from "react";
import { UpdateAnimePayload } from "../types/dashboard";
import { WatchStatusEnum } from "../../../api/enums";
import * as userAnimeApi from "../../../api/userAnimeStatusApi";

/**
 * Hook for editing anime status and rating (owner only)
 * Performs optimistic update + backend call
 */
export function useAnimeEdit(onUpdate: (payload: UpdateAnimePayload) => void) {
  /**
   * Update status of an anime
   * @param animeId - Anime identifier
   * @param status - New watch status or null to remove
   */
  const setStatus = useCallback(
    async (animeId: number, status: WatchStatusEnum | null) => {
      // optimistic update
      onUpdate({ animeId, status });

      try {
        if (status !== null) {
          await userAnimeApi.setStatus(animeId, status);
        } else {
          await userAnimeApi.removeStatus(animeId);
        }
      } catch (err) {
        console.error("Failed to update status", err);
      }
    },
    [onUpdate]
  );

  /**
   * Update rating of an anime
   * @param animeId - Anime identifier
   * @param rating - New rating (1-10) or null to remove
   */
  const setRating = useCallback(
    async (animeId: number, rating: number | null) => {
      // optimistic update
      onUpdate({ animeId, rating });

      try {
        if (rating !== null) {
          await userAnimeApi.setRating(animeId, rating);
        } else {
          await userAnimeApi.removeRating(animeId);
        }
      } catch (err) {
        console.error("Failed to update rating", err);
      }
    },
    [onUpdate]
  );

  /**
   * Combined update for status and/or rating
   */
  const updateAnime = useCallback(
    async (payload: UpdateAnimePayload) => {
      // optimistic update
      onUpdate(payload);

      if (payload.status !== undefined) {
        await setStatus(payload.animeId, payload.status);
      }

      if (payload.rating !== undefined) {
        await setRating(payload.animeId, payload.rating);
      }
    },
    [onUpdate, setStatus, setRating]
  );

  return {
    setStatus,
    setRating,
    updateAnime,
  };
}
