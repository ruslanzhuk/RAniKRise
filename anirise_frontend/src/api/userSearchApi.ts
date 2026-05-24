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

export type UserProfileDTO = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  birthDate?: string | null;
  gender?: "Male" | "Female" | "Other" | null;
  role: string;
  createdAt: string;
  joinedOn: string;
  visibility: "Public" | "Private";
  themePreference?: string | null;
};

export type GetUsersParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  sortByCollection?: boolean;
};

export const fetchUsers = async (params: GetUsersParams): Promise<UserProfileDTO[]> => {
  try {
    const { data } = await animeApi.get<UserProfileDTO[]>("/user/list", { params });
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
