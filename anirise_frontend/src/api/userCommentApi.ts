import http from "./http";
import {
  CommentDTO
} from "./types/comment.types";
import { ReactionType } from "./types/club.types";

export const commentApi = {

  getUserComments: async (userId: string): Promise<CommentDTO[]> => {
    const { data } = await http.get<CommentDTO[]>(`/Comment/User/${userId}`);
    return data;
  },

  createUserComment: async (
    userId: string,
    content: string,
    parentCommentId?: number
  ): Promise<CommentDTO> => {
    const payload = {
      targetType: "User",
      targetIdGuid: userId,
      content,
      parentCommentId,
    };
    const { data } = await http.post<CommentDTO>("/Comment", payload);
    return data;
  },

  deleteComment: async (commentId: number) => {
    return http.delete(`/Comment/${commentId}`);
  },
};