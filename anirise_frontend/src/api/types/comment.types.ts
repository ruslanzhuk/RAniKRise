import { ReactionType } from './club.types';

export interface CommentDTO {
  id: number;
  userId: string;
  username: string;
  content: string;
  targetType: 'ClubPost' | 'Anime' | 'User';
  targetIdLong?: number;
  targetIdGuid?: string;
  parentCommentId?: number;
  replies?: CommentDTO[];
  likes: number;
  dislikes: number;
  userReaction?: ReactionType;
  createdAt: string;
}

export interface CommentCreateRequest {
  targetType: 'ClubPost' | 'Post' | 'Anime' | 'User';
  targetIdLong?: number;
  // For User
  targetIdGuid?: string;
  content: string;
  parentCommentId?: number;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface CommentReactionRequest {
  reaction: ReactionType;
}
