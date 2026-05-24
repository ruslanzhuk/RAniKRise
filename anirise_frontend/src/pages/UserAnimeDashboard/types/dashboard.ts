import { WatchStatusEnum } from "../../../api/enums";

export interface DashboardAnimeItem {
  animeId: number;
  title: string;
  coverImage: string | null;
  status: WatchStatusEnum;
  rating: number | null;
  updatedAt?: string;
}

export interface UserAnimeDashboardData {
  username: string;
  isOwner: boolean;
  totalAnime: number;
  averageRating: number | null;
  list: DashboardAnimeItem[];
}


export type DashboardViewMode =
  | "wall"
  | "timeline"
  | "stats";


export interface DashboardFilters {
  status?: WatchStatusEnum;
  minRating?: number;
  search?: string;
}


export interface UpdateAnimePayload {
  animeId: number;
  status?: WatchStatusEnum | null;
  rating?: number | null;
}
