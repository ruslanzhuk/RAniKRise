import http from "./http";
import type { PostResponseDTO, PostCreateDTO, PostUpdateDTO } from "./types/post.types";

const BASE = "/posts";

export const postApi = {
  create: async (formData: FormData): Promise<PostResponseDTO> => {
    const { data } = await http.post<PostResponseDTO>(BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  getUserPosts: async (userId: string): Promise<PostResponseDTO[]> => {
    const { data } = await http.get<PostResponseDTO[]>(`${BASE}/user/${userId}`);
    return data;
  },

  update: async (postId: number, dto: PostUpdateDTO): Promise<PostResponseDTO> => {
    const { data } = await http.put<PostResponseDTO>(`${BASE}/${postId}`, dto);
    return data;
  },

  delete: async (postId: number): Promise<void> => {
    await http.delete(`${BASE}/${postId}`);
  },
};
