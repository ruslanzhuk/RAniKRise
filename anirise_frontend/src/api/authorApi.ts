import axios from "axios";
import { AuthorDTO } from "./types/author.types";


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


export const getAuthorsByAnime = async (animeId: number): Promise<AuthorDTO[]> => {
  const res = await api.get<AuthorDTO[]>(`/author/anime/${animeId}`);
  return res.data;
};

export const getAuthorById = async (id: number): Promise<AuthorDTO> => {
  const res = await api.get<AuthorDTO>(`/author/${id}`);
  return res.data;
};

export const searchAuthors = async (query: string): Promise<AuthorDTO[]> => {
  const res = await api.get<AuthorDTO[]>("/author", { params: { query } });
  return res.data;
};
