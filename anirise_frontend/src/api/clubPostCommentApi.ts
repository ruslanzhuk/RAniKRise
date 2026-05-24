import { commentApi } from './commentApi';
import { CommentDTO, CommentCreateRequest } from './types/comment.types';
import { ReactionType } from './types/club.types';

export const clubPostCommentsApi = {
  getComments: async (postId: number): Promise<CommentDTO[]> => {
    return commentApi.getComments('ClubPost', postId);
  },

  createComment: async (postId: number, content: string, replyToCommentId?: number): Promise<CommentDTO> => {
    const payload: CommentCreateRequest = {
      targetType: 'ClubPost',
      targetIdLong: postId,
      content,
      parentCommentId: replyToCommentId,
    };
    return commentApi.createComment(payload);
  },

  reactComment: async (commentId: number, reaction: ReactionType) => {
    return commentApi.reactComment(commentId, reaction);
  },

  updateComment: async (commentId: number, content: string) => {
    return commentApi.updateComment(commentId, content);
  },

  deleteComment: async (commentId: number) => {
    return commentApi.deleteComment(commentId);
  },
};