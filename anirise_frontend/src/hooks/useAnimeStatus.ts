import { useState, useEffect, useCallback } from "react";
import { WatchStatusEnum } from "../api/enums";
import * as userAnimeApi from "../api/userAnimeStatusApi";
import { RatingDTO } from "../api/userAnimeStatusApi";

export const useAnimeStatus = (animeId: number | null) => {
  const [status, setStatus] = useState<WatchStatusEnum | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [aniRiseRating, setAniRiseRating] = useState<number>(0);
  const [aniRiseVotes, setAniRiseVotes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // ------------------ INIT ------------------
  useEffect(() => {
    if (!animeId) return;

    const init = async () => {
      setLoading(true);
      try {
        const userStatus = await userAnimeApi.getStatus(animeId);
        setStatus(userStatus?.status ?? null);

        const userRating = await userAnimeApi.getRating(animeId);
        setRating(userRating?.score ?? null);
        setAniRiseRating(userRating?.aniRiseRating ?? 0);
        setAniRiseVotes(userRating?.aniRiseVotes ?? 0);

        console.log("INIT", {
          rating: userRating?.score,
          aniRiseRating: userRating?.aniRiseRating,
          aniRiseVotes: userRating?.aniRiseVotes,
        });
      } catch (e) {
        console.error("Failed to load user status/rating:", e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [animeId]);

  // ------------------ TOGGLE STATUS ------------------
  const toggleStatus = useCallback(
    async (newStatus: WatchStatusEnum) => {
      if (!animeId) return;

      const prevStatus = status;
      setStatus(prev => (prev === newStatus ? null : newStatus));
      console.log("TOGGLE STATUS", { prevStatus, newStatus });

      try {
        if (prevStatus === newStatus) {
          await userAnimeApi.removeStatus(animeId);
        } else {
          await userAnimeApi.setStatus(animeId, newStatus);
        }
      } catch (err) {
        console.error("Failed to update status:", err);
        setStatus(prevStatus); // rollback
      }
    },
    [animeId, status]
  );

  // ------------------ UPDATE RATING ------------------
  const updateRating = useCallback(
    async (score: number) => {
      if (!animeId) return;

      const prev = rating;
      setRating(score === rating ? null : score);
      console.log("UPDATE RATING start", { prev, new: score });

      try {
        let result: RatingDTO;
        if (prev === score) {
          result = await userAnimeApi.removeRating(animeId);
          setRating(null);
        } else {
          result = await userAnimeApi.setRating(animeId, score);
          setRating(score);
        }

        setAniRiseRating(result.aniRiseRating);
        setAniRiseVotes(result.aniRiseVotes);

        console.log("UPDATE RATING success", {
          rating: score,
          aniRiseRating: result.aniRiseRating,
          aniRiseVotes: result.aniRiseVotes,
        });
      } catch (err) {
        console.error("Failed to update rating:", err);
        setRating(prev); // rollback
      }
    },
    [animeId, rating]
  );

  // ------------------ DEBUG LOG ------------------
  useEffect(() => {
    console.log("STATE CHANGE:", { status, rating, aniRiseRating, aniRiseVotes });
  }, [status, rating, aniRiseRating, aniRiseVotes]);

  return {
    status,
    rating,
    aniRiseRating,
    aniRiseVotes,
    loading,
    toggleStatus,
    updateRating,
  };
};
