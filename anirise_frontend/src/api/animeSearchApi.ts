import http from "./http";

export enum AnimeSortBy {
  Score = "Score",
  Popularity = "Popularity",
  Alphabet = "Alphabet",
  ReleaseDate = "ReleaseDate"
}

export interface AnimeSearchRequest {
  statuses?: string[];
  types?: string[];
  shortTv?: boolean;
  middleTv?: boolean;
  longTv?: boolean;
  minScore?: number;
  ageRatings?: string[];
  genreIds?: number[];
  
  fromDate?: string;
  toDate?: string;

  sortBy?: AnimeSortBy;
  desc?: boolean;

  page?: number;
  pageSize?: number;
}

export interface AnimeCardDto {
  id: number;
  title: string;
  posterUrl?: string;
  shortDescription: string;

  type: string;
  status: string;
  episodes: number;
  releaseYear: number;
  ageRating?: string;

  studios: string[];
  genres: string[];

  averageScore: number;
  scoredBy?: number;
}

export interface PagedAnimeResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  items: T[];
}

export const searchAnime = async (
  request: AnimeSearchRequest
): Promise<PagedAnimeResult<AnimeCardDto>> => {
  const res = await http.post<PagedAnimeResult<AnimeCardDto>>(
    "/anime/search",
    request
  );

  return res.data;
};
