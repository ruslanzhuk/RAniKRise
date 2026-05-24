import axios from "axios";
import { StudioDTO, StudioMiniDTO } from "./types/studio.types";

const api = axios.create({
  baseURL: "http://localhost:5000/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/* =========================
   API METHODS
========================= */

export const getStudiosMini = async (): Promise<StudioMiniDTO[]> => {
  const res = await api.get<StudioMiniDTO[]>("/studio/mini");
  return res.data;
};

export const searchStudios = async (
  query: string,
  page = 1,
  pageSize = 20
): Promise<StudioMiniDTO[]> => {
  const res = await api.get<StudioMiniDTO[]>("/studio/search", {
    params: { query, page, pageSize },
  });
  return res.data;
};

export const getStudioById = async (id: number): Promise<StudioDTO> => {
  const res = await api.get<StudioDTO>(`/studio/${id}`);
  return res.data;
};
