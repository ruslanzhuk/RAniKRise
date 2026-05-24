import { WatchStatusEnum } from "./enums";

export interface UserStatsDTO {
  totalAnime: number;
  totalWatching: number;
  totalCompleted: number;
  totalPlanned: number;
  totalDropped: number;
  totalOnHold: number;
}

export interface UserAnimeListItemDTO {
  animeId: number;
  title: string;
  coverImage?: string | null;
  status: WatchStatusEnum;
  rating?: number | null;
}

const BASE_URL = "http://localhost:5000/api/user-anime/public";

export async function getUserAnimeStats(username: string) {
  const res = await fetch(`${BASE_URL}/${username}/stats`);
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json() as Promise<UserStatsDTO>;
}

export async function getUserAnimeList(
  username: string,
  status?: WatchStatusEnum
) {
  const url = status
    ? `${BASE_URL}/${username}/list?status=${status}`
    : `${BASE_URL}/${username}/list`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load anime list");
  return res.json() as Promise<UserAnimeListItemDTO[]>;
}
