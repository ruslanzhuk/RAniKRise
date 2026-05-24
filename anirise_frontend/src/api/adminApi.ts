import { AnimeStatus, AnimeType, AdminAnimeListItemDTO, AdminAnimeDetailsDTO, CreateAnimeAdminDTO, UpdateAnimeAdminDTO, AdminGenreDTO, CommentTargetType, AdminComment } from "./types/adminAll.types";
import { ClubDetailDTO, ClubCreateDTO, ClubUpdateDTO, ClubSearchDTO } from "./types/adminAll.types";
import { ClubPostDTO } from "./types/adminAll.types";
import { AdminProfileDto } from "./types/adminAll.types";
import {
  HomeAnnouncementDto,
  CreateHomeAnnouncementRequest,
  UpdateHomeAnnouncementRequest,
} from "./types/adminAll.types";
import { NewsAdminDetailsDto, NewsAdminPreviewDto } from "./types/adminAll.types";
import { MediaEntity, MediaDto, MediaType } from "./types/adminAll.types";


import axios from "axios";  

const http = axios.create({
  baseURL: "http://localhost:5000/api",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});


/* =======================
   ANIME CRUD
======================= */

// GET /api/admin/anime
export const adminGetAnimes = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}) => {
  const res = await http.get<{
    items: AdminAnimeListItemDTO[];
    totalCount: number;
  }>("/admin/anime", { params });
  return res.data;
};

// GET /api/admin/anime/{id}
export const adminGetAnimeById = async (
  id: number
): Promise<AdminAnimeDetailsDTO> => {
  const res = await http.get<AdminAnimeDetailsDTO>(`/admin/anime/${id}`);
  return res.data;
};

// POST /api/admin/anime
export const adminCreateAnime = async (
  data: CreateAnimeAdminDTO
): Promise<number> => {
  const res = await http.post<number>("/admin/anime", data); // повертаємо ID нового аніме
  return res.data;
};

// PUT /api/admin/anime/{id}
export const adminUpdateAnime = async (
  id: number,
  data: UpdateAnimeAdminDTO
): Promise<void> => {
  await http.put(`/admin/anime/${id}`, data);
};

// DELETE /api/admin/anime/{id}
export const adminDeleteAnime = async (id: number): Promise<void> => {
  await http.delete(`/admin/anime/${id}`);
};

// GET /api/genres
export const adminGetGenres = async (): Promise<AdminGenreDTO[]> => {
  const res = await http.get<AdminGenreDTO[]>("/genres");
  return res.data;
};

/* =======================
   CLUB API
======================= */

export const adminGetClubs = async (): Promise<ClubSearchDTO[]> => {
  const res = await http.get<ClubSearchDTO[]>("/clubs");
  return res.data;
};

export const adminGetMyClubs = async (): Promise<ClubSearchDTO[]> => {
  const res = await http.get<ClubSearchDTO[]>("/clubs/admin/me");
  return res.data;
};

export const adminGetClubById = async (id: number): Promise<ClubDetailDTO> => {
  const res = await http.get<ClubDetailDTO>(`/clubs/${id}`);
  return res.data;
};

export const adminCreateClub = async (payload: ClubCreateDTO): Promise<number> => {
  const res = await http.post<ClubDetailDTO>("/clubs", payload);
  return res.data.id;
};

export const adminUpdateClub = async (id: number, payload: ClubUpdateDTO): Promise<void> => {
  await http.put(`/clubs/${id}`, payload);
};

export const adminDeleteClub = async (id: number): Promise<void> => {
  await http.delete(`/clubs/${id}`);
};


/* =======================
    Club Posts API
  ======================= */

export const adminGetClubPosts = async (
  clubId: number
): Promise<ClubPostDTO[]> => {
  const { data } = await http.get<ClubPostDTO[]>(
    `/clubs/${clubId}/posts`
  );
  return data;
};

export const adminGetClubPostById = async (
  postId: number
): Promise<ClubPostDTO> => {
  const { data } = await http.get<ClubPostDTO>(
    `/clubs/posts/${postId}`
  );
  return data;
};

export const adminCreateClubPost = async (
  clubId: number,
  formData: FormData
): Promise<ClubPostDTO> => {
  const { data } = await http.post<ClubPostDTO>(
    `/clubs/${clubId}/posts`,
    formData
  );
  return data;
};

export const adminUpdateClubPost = async (
  postId: number,
  formData: FormData
): Promise<ClubPostDTO> => {
  const { data } = await http.put<ClubPostDTO>(
    `/clubs/posts/${postId}`,
    formData
  );
  return data;
};

export const adminDeleteClubPost = async (
  postId: number
): Promise<void> => {
  await http.delete(`/clubs/posts/${postId}`);
};

// src/api/admin/clubPostsApi.ts
export const adminUploadClubPostMedia = async (
  file: File
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await http.post<{ url: string }>(
    "/clubs/posts/media",
    formData
  );

  return data;
};

export const getAdminProfile = async (): Promise<AdminProfileDto> => {
  const res = await http.get<AdminProfileDto>("/admin/me");
  return res.data;
};

// =======================
// HOME ANNOUNCEMENTS API
// =======================

// ACTIVE (admin list теж може це юзати)
export const getActiveHomeAnnouncement = async () => {
  const res = await http.get<HomeAnnouncementDto | null>(
    "/home-announcement"
  );
  return res.data;
};

// GET BY ID (для edit)
export const getHomeAnnouncementById = async (id: number) => {
  const res = await http.get<HomeAnnouncementDto>(
    `/home-announcement/${id}`
  );
  return res.data;
};

export const createHomeAnnouncement = async (data: {
  title: string;
  contentHtml: string;
  media?: File;
}) => {
  const form = new FormData();
  form.append("title", data.title);
  form.append("contentHtml", data.contentHtml);

  if (data.media) {
    form.append("media", data.media);
  }

  await http.post("/home-announcement", form);
};

export const updateHomeAnnouncement = async (
  id: number,
  data: {
    title?: string;
    contentHtml?: string;
    media?: File;
  }
) => {
  const form = new FormData();

  if (data.title) form.append("title", data.title);
  if (data.contentHtml)
    form.append("contentHtml", data.contentHtml);
  if (data.media) form.append("media", data.media);

  await http.put(`/home-announcement/${id}`, form);
};

export const deactivateHomeAnnouncement = async (id: number) => {
  await http.delete(`/home-announcement/${id}`);
};


// =======================
// NEWS API
// =======================

export const getAdminNews = async () => {
  const res = await http.get<NewsAdminPreviewDto[]>("/news");
  return res.data;
};

export const getAdminNewsById = async (id: number) => {
  const res = await http.get<NewsAdminDetailsDto>(`/news/${id}`);
  return res.data;
};

export const uploadNewsMedia = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await http.post<{ url: string }>("/news/media", formData);
  return data;
};

export const createNews = async (data: {
  title: string;
  previewContent: string;
  contentHtml: string;
}) => {
  await http.post("/news", data);
};

export const updateNews = async (
  id: number,
  data: Partial<{
    title: string;
    previewContent: string;
    contentHtml: string;
  }>
) => {
  await http.put(`/news/${id}`, data);
};

export const deleteNews = async (id: number) => {
  await http.delete(`/news/${id}`);
};


// MEDIA UPLOAD

export const mediaBrowserApi = {
  getAnime: () =>
    http.get<MediaEntity[]>("/admin/media-browser/anime"),

  getAuthors: () =>
    http.get<MediaEntity[]>("/admin/media-browser/authors"),

  getCharacters: () =>
    http.get<MediaEntity[]>("/admin/media-browser/characters"),

  getStudios: () =>
    http.get<MediaEntity[]>("/admin/media-browser/studios"),
};

export const getEntityMedia = (
  entity: string,
  entityId: number
) =>
  http.get<MediaDto[]>(
    `/admin/media/${entity}/${entityId}`
  );

export const uploadMedia = (
  entity: string,
  entityId: number,
  type: MediaType,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return http.post<MediaDto>(
    `/admin/media/${entity}/${entityId}?type=${type}`,
    formData
  );
};

export const updateMediaType = (
  mediaId: number,
  type: MediaType
) =>
  http.put(
    `/admin/media/${mediaId}/type?type=${type}`
  );

export const deleteMedia = (mediaId: number) =>
  http.delete(`/admin/media/${mediaId}`);

// ======================
// ADMIN COMMENT DTO
// ======================

export type GetCommentsParams = {
  targetType?: string;
  targetEntityId?: number;
  targetUserId?: string;
};


export const adminCommentsApi = {
  get: (params: GetCommentsParams) => {
    return http.get<AdminComment[]>("/admin/comments", { params });
  },

  getById: (id: number) => {
    return http.get<AdminComment>(`/admin/comments/${id}`);
  },

  delete: (id: number) => {
    return http.delete(`/admin/comments/${id}`);
  },

  blockUser: (userId: string) => {
    return http.post(`/admin/comments/block-user/${userId}`);
  },
};