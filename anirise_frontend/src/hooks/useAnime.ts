import { useState, useEffect } from "react";
import {
  getCurrentlyAiringAnime,
  getPopularAnime,
  getUpcomingAnime,
  Anime,
} from "../api/animeApi";

type AnimeType = "airing" | "upcoming" | "popular";

interface UseAnimeResult {
  data: Anime[] | null;
  loading: boolean;
  error: string | null;
}

const useAnime = (type: AnimeType, limit = 3): UseAnimeResult => {
  const [data, setData] = useState<Anime[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);

      try {
        let animes: Anime[] = [];

        switch (type) {
          case "airing":
            animes = await getCurrentlyAiringAnime(limit);
            break;
          case "popular":
            animes = await getPopularAnime(limit);
            break;
          case "upcoming":
            animes = await getUpcomingAnime(limit);
            break;
        }

        setData(animes);
      } catch (err: any) {
        setError(err.message || "Błąd pobierania danych");
        console.error(`useAnime error [${type}]:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [type, limit]);

  return { data, loading, error };
};

export default useAnime;