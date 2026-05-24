import { useEffect, useMemo, useState } from "react";
import {
  DashboardAnimeItem,
  DashboardFilters,
  UpdateAnimePayload,
  UserAnimeDashboardData,
} from "../types/dashboard";
import { getUserAnimeList } from "../../../api/userAnimePublicApi";
import { getCurrentUser } from "../../../api/animeApi";
import { useAnimeEdit } from "./useAnimeEdit";

/**
 * Main hook for user anime dashboard
 */
export function useUserAnimeDashboard(username: string | undefined) {
  const [data, setData] = useState<UserAnimeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DashboardFilters>({});

  const { updateAnime: backendUpdateAnime } = useAnimeEdit((payload: UpdateAnimePayload) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            list: prev.list.map((item) =>
              item.animeId === payload.animeId
                ? {
                    ...item,
                    status: payload.status ?? item.status,
                    rating: payload.rating !== undefined ? payload.rating : item.rating,
                  }
                : item
            ),
          }
        : prev
    );
  });

  useEffect(() => {
    if (!username) {
        setLoading(false);
        return;
    }

    const safeUsername: string = username;

    let cancelled = false;

    async function load() {
        setLoading(true);

        try {
        const [list, me] = await Promise.all([
            getUserAnimeList(safeUsername),
            getCurrentUser().catch(() => null),
        ]);

        if (cancelled) return;

        const dashboardList: DashboardAnimeItem[] = list.map((item) => ({
            animeId: item.animeId,
            title: item.title,
            coverImage: item.coverImage ?? null,
            status: item.status,
            rating: item.rating ?? null,
        }));

        setData({
            username: safeUsername,
            isOwner: me?.username === safeUsername,
            totalAnime: dashboardList.length,
            averageRating: null,
            list: dashboardList,
        });
        } finally {
        if (!cancelled) setLoading(false);
        }
    }

    load();

    return () => {
        cancelled = true;
    };
    }, [username]);

  const visibleList = useMemo(() => {
    if (!data) return [];
    return data.list.filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.minRating && (!item.rating || item.rating < filters.minRating)) return false;
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [data, filters]);

  const updateAnime = (payload: UpdateAnimePayload) => {
    backendUpdateAnime(payload);
  };

  return {
    data,
    loading,
    list: visibleList,
    filters,
    setFilters,
    updateAnime,
  };
}
