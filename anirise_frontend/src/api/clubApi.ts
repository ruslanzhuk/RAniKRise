import http from './http';
import { ClubDetailDTO, ClubPostDTO, ReactionType } from './types/club.types'; 

export const clubApi = {
  getClubDetail: async (clubId: number) => {
    const res = await http.get<ClubDetailDTO>(`/clubs/${clubId}`);
    return res.data;
  },

  joinClub: async (clubId: number) => {
    const res = await http.post(`/clubs/${clubId}/join`);
    return res.data;
  },

  leaveClub: async (clubId: number) => {
    const res = await http.post(`/clubs/${clubId}/leave`);
    return res.data;
  },

  getClubPosts: async (clubId: number, offset = 0, limit = 10) => {
    const res = await http.get<ClubPostDTO[]>(
      `/clubs/${clubId}/posts?offset=${offset}&limit=${limit}`
    );
    return res.data;
  },

  getUserClubs: async (userId: string) => {
    const res = await http.get<ClubDetailDTO[]>(`/clubs/user/${userId}`);
    return res.data;
  },

  createPost: async (clubId: number, content: string, mediaIds?: number[]) => {
    const res = await http.post<ClubPostDTO>(`/clubs/${clubId}/posts`, {
      content,
      mediaIds,
    });
    return res.data;
  },

  reactPost: async (postId: number, reaction: ReactionType) => {
    const res = await http.post(`/clubs/posts/${postId}/reaction`, { reaction });
    return res.data;
  },
};
