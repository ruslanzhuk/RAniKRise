import axios from "axios";

const animeApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

animeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default animeApi;

// Type for one anime
export type Anime = {
  id: number;
  title: string;
  posterUrl?: string;
  type?: string;
  year?: number;
  episodes?: number;
  synopsis?: string;
  genres: string[];
  studios: string[];
  score?: number;
};

export type AnimePreview = {
  id: number;
  title: string;
  posterUrl?: string;
  type?: string;
  year?: number;
  score?: number;
};

export type CharacterAnimeDTO = {
  id: number;
  title: string;
  role: string;
  posterUrl?: string | null;
};

export interface AnimeStudioDTO {
  id: number;
  name: string;
}

export type AnimeAuthorDTO = {
  id: number;
  name: string;
  role: string;
};

export type AnimeDetailDTO = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;

  malRating: number;
  malScoredBy?: number;
  aniRiseRating: number;
  aniRiseScoredBy: number;

  type: string;
  status: string;
  genres: string[];
  studios: AnimeStudioDTO[];
  authors: AnimeAuthorDTO[];
  mediaUrls: string[];
  mainCharacters: CharacterAnimeDTO[];
};


type AnimeResponse = {
  animes: Anime[];
};

export type AnimeShortDTO = {
  id: number;
  title: string;
  imageUrl?: string | null;
};

export type NewsItem = {
  title: string;
  excerpt: string;
};

// GET /anime
export const getAnimeList = async (): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>("/anime");
    return response.data.animes;
  } catch (error) {
    console.error("Error fetching anime list", error);
    return [];
  }
};

// GET /anime/search?query=...
export const searchAnime = async (query: string): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/search?query=${encodeURIComponent(query)}`);
    return response.data.animes;
  } catch (error) {
    console.error("Error searching anime", error);
    return [];
  }
};

// GET /popular?limit=...
export const getPopularAnime = async (limit = 18, offset = 0): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/popular?limit=${limit}&offset=${offset}`);
    return response.data.animes;
  } catch (error) {
    console.error("Error fetching popular anime", error);
    return [];
  }
};

// GET /airing?limit=...
export const getCurrentlyAiringAnime = async (limit: number = 18, offset: number = 0): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/airing?limit=${limit}&offset=${offset}`);
    console.log("Airing Anime Data:", response.data);
    return response.data.animes;
  } catch (error: any) {
    console.error("Error fetching currently airing anime:", error.message);
    throw error;
  }
};

// GET /top-series?limit=...
export const getTopSeries = async (limit: number = 10): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/top-series?limit=${limit}`);
    return response.data.animes;
  } catch (error) {
    console.error("Error fetching top series", error);
    return [];
  }
};

// GET /top-movies?limit=...
export const getTopMovies = async (limit: number = 10): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/top-movies?limit=${limit}`);
    return response.data.animes;
  } catch (error) {
    console.error("Error fetching top movies", error);
    return [];
  }
};

// GET /top-rated?limit=...
export const getTopRatedOnPlatform = async (limit: number = 10): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/top-rated?limit=${limit}`);
    return response.data.animes;
  } catch (error) {
    console.error("Error fetching top rated on platform", error);
    return [];
  }
};

export const getAnimeById = async (id: number): Promise<Anime | null> => {
  try {
    const response = await animeApi.get<Anime>(`/anime/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime by ID", error);
    return null;
  }
};

export const getAnimeDetails = async (id: number): Promise<AnimeDetailDTO | null> => {
  try {
    const response = await animeApi.get<AnimeDetailDTO>(`/anime/${id}/details`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for anime ID ${id}:`, error);
    return null;
  }
};

// GET /upcoming?limit=...
export const getUpcomingAnime = async (limit = 10): Promise<Anime[]> => {
  try {
    const response = await animeApi.get<AnimeResponse>(`/anime/upcoming?limit=${limit}`);
    return response.data.animes;
  } catch (error) {
    console.error("Error fetching upcoming anime", error);
    return [];
  }
};

export const getByCharacter = async (characterId: number): Promise<AnimeShortDTO[]> => {
  try {
    const res = await animeApi.get<AnimeShortDTO[]>(`/anime/by-character/${characterId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching anime by character", error);
    return [];
  }
};


// ========= USER TYPES =========

export type UserDto = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  createdAt: string;

  birthDate?: string | null;
  gender?: string | null;
  joinedOn?: string;
};

export type PublicProfile = {
  id: string;
  username: string;
  avatarUrl?: string | null;
  joinedOn: string;
  collections: number;
  visibility: "Public" | "Private";
};

export type UserStats = {
  totalAnime: number;
  totalCompleted: number;
  totalWatching: number;
  totalPlanned: number;
  totalDropped: number;
  totalOnHold: number;
};



export type UpdateUserRequest = {
  username?: string;
  email?: string;
  password?: string;
};

export type UpdateAvatarRequest = {
  avatarUrl: string;
};

type UpdateAvatarResponse = {
  avatarUrl: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

// ========= USER ROUTES =========

// POST /user/register
export const registerUser = async (data: RegisterRequest): Promise<UserDto> => {
  const res = await animeApi.post<UserDto>("/user/register", data);
  return res.data;
};

// POST /user/login
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await animeApi.post<LoginResponse>("/user/login", data);
  return res.data;
};

// GET /user/confirm-email?token=...
export const confirmEmail = async (token: string) => {
  const res = await animeApi.get(`/user/confirm-email?token=${token}`);
  return res.data;
};

// GET /user/me
export const getCurrentUser = async (): Promise<UserDto> => {
  const response = await animeApi.get<UserDto>("/user/me");
  return response.data;
};

// PUT /user/update
export const updateUser = async (data: UpdateUserRequest): Promise<UserDto> => {
  const res = await animeApi.put<UserDto>("/user/update", data);
  return res.data;
};

// GET /user/stats
export const getUserStats = async (): Promise<UserStats> => {
  const response = await animeApi.get<UserStats>("/user/stats");
  return response.data;
};


// GET /user/public/:id
export const getPublicProfile = async (userId: string): Promise<PublicProfile> => {
  const response = await animeApi.get<PublicProfile>(`/user/public/${userId}`);
  return response.data;
};

// PUT /user/avatar

export const updateAvatar = async (data: UpdateAvatarRequest): Promise<UpdateAvatarResponse> => {
  const res = await animeApi.put<UpdateAvatarResponse>("/user/avatar", data);
  return res.data;
};

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const response = await animeApi.get<{ isTaken: boolean }>(`/user/check-username?username=${encodeURIComponent(username)}`);
  return response.data.isTaken;
};

export const getPublicProfileByUsername = async (username: string): Promise<PublicProfile> => {
  const response = await animeApi.get<PublicProfile>(`/user/public/by-username/${encodeURIComponent(username)}`);
  return response.data;
};





// ========= SEARCH FUNCTION =========

export type AnimeSearchDTO = {
  id: number;
  title: string;
  rating?: number | null;
  posterUrl?: string | null;
};

export type CharacterSearchDTO = {
  id: number;
  name: string;
  imageUrl?: string | null;
};

export type UserSearchDTO = {
  id: string;
  username: string;
  avatarUrl?: string | null;
};

export type StudioSearchDTO = {
  id: number;
  name: string;
  description?: string | null;
  animeCount: number;
  logoUrl?: string | null;
};

export type AuthorSearchDTO = {
  id: number;
  fullName: string;
  imageUrl?: string | null;
  birthDate?: string | null;
  worksCount?: number;
};

export type NewsSearchDTO = {
  id: number;
  title: string;
  createdAt: string;
  authorName: string;
};

export type ClubSearchDTO = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  membersCount: number;
  createdAt: string;
};

export type SearchResultDTO = {
  totalResults: number;

  animes?: AnimeSearchDTO[];
  characters?: CharacterSearchDTO[];
  users?: UserSearchDTO[];
  studios?: StudioSearchDTO[];
  authors?: AuthorSearchDTO[];
  news?: NewsSearchDTO[];
  clubs?: ClubSearchDTO[];
};

export const searchAll = async (
  type: string,
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResultDTO | null> => {
  try {
    const response = await animeApi.get<SearchResultDTO>(
      `/search?type=${type}&query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
    );

    return response.data;
  } catch (error) {
    console.error("Error searching", error);
    return null;
  }
};

// ======== END =========