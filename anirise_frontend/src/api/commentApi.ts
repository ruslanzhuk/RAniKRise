import http from './http';
import { CommentDTO, CommentCreateRequest, CommentReactionRequest } from './types/comment.types';
import { ReactionType } from './types/club.types';

export const commentApi = {
  getComments: async (targetType: string, targetId: number | string): Promise<CommentDTO[]> => {
    const res = await http.get<CommentDTO[]>(`/comment/${targetType}/${targetId}`);
    return res.data;
  },

  getCommentsForUser: async (userId: string): Promise<CommentDTO[]> => {
    const res = await http.get<CommentDTO[]>(`/comment/User/${userId}`);
    return res.data;
  },

  createComment: async (payload: CommentCreateRequest): Promise<CommentDTO> => {
    const res = await http.post<CommentDTO>('/comment', payload);
    return res.data;
  },

  updateComment: async (commentId: number, content: string): Promise<CommentDTO> => {
    const res = await http.put<CommentDTO>(`/comment/${commentId}`, { content });
    return res.data;
  },

  deleteComment: async (commentId: number): Promise<{ message: string }> => {
    const res = await http.delete<{ message: string }>(`/comment/${commentId}`);
    return res.data;
  },

  reactComment: async (commentId: number, reaction: ReactionType): Promise<{ message: string }> => {
    const res = await http.post<{ message: string }>(
      `/comment/${commentId}/reaction`,
      { reaction } as CommentReactionRequest
    );
    return res.data;
  },
};
