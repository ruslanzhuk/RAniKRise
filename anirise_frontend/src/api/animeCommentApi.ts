import http from "./http";
import {
  CommentDTO,
  CommentCreateRequest,
  CommentReactionRequest,
} from "./types/comment.types";
import { ReactionType } from "./types/club.types";

export const animeCommentApi = {
  getAnimeComments: async (animeId: number): Promise<CommentDTO[]> => {
    const { data } = await http.get<CommentDTO[]>(
      `/Comment/Anime/${animeId}`
    );
    return data;
  },

  createAnimeComment: async (
    animeId: number,
    content: string,
    parentCommentId?: number
  ): Promise<CommentDTO> => {
    const payload: CommentCreateRequest = {
      targetType: "Anime",
      targetIdLong: animeId,
      content,
      parentCommentId,
    };

    const { data } = await http.post<CommentDTO>(
      "/Comment",
      payload
    );

    return data;
  },

  react: async (
    commentId: number,
    reaction: ReactionType
  ): Promise<void> => {
    await http.post(
      `/Comment/${commentId}/reaction`,
      { reaction } as CommentReactionRequest
    );
  },
};
