import { WatchStatusEnum } from "./enums";
import http from "./http";

export interface UserAnimeStatusDTO {
  animeId: number;
  status: WatchStatusEnum;
  statusId: number;
}

interface UserAnimeStatusBackend {
  animeId: number;
  statusId: number;
  watchStatus: {
    id: number;
    statusName: string;
  };
}

export interface RatingDTO {
  animeId: number;
  score: number | null;
  aniRiseRating: number;
  aniRiseVotes: number;
  id?: number; 
}

const BASE_URL = "/user-anime/status";

// ----------------- STATUS -----------------

export const getStatus = async (animeId: number): Promise<UserAnimeStatusDTO | null> => {
  try {
    const res = await http.get<UserAnimeStatusBackend>(`${BASE_URL}/${animeId}/status`);
    if (!res.data) return null;

    const statusEnum = WatchStatusEnum[res.data.watchStatus.statusName as keyof typeof WatchStatusEnum];

    return {
      animeId: res.data.animeId,
      status: statusEnum,
      statusId: res.data.statusId,
    };
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};



export const setStatus = async (animeId: number, status: WatchStatusEnum): Promise<UserAnimeStatusDTO> => {
  const res = await http.post<UserAnimeStatusBackend>(`${BASE_URL}/${animeId}`, null, { params: { status } });
  
  const statusEnum = WatchStatusEnum[res.data.watchStatus.statusName as keyof typeof WatchStatusEnum];

  return {
    animeId: res.data.animeId,
    status: statusEnum,
    statusId: res.data.statusId,
  };
};


export const removeStatus = async (animeId: number): Promise<void> => {
  await http.delete(`${BASE_URL}/${animeId}`);
};

// ----------------- RATING -----------------

export const getRating = async (animeId: number): Promise<RatingDTO | null> => {
  try {
    const res = await http.get<RatingDTO>(`${BASE_URL}/${animeId}/rating`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
};

export const setRating = async (animeId: number, score: number): Promise<RatingDTO> => {
  const res = await http.post<RatingDTO>(`${BASE_URL}/${animeId}/rating`, null, {
    params: { score },
  });
  return res.data;
};

export const removeRating = async (animeId: number): Promise<RatingDTO> => {
  const res = await http.delete<RatingDTO>(`${BASE_URL}/${animeId}/rating`);
  return res.data;
};
