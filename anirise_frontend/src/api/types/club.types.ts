// Club detail (for Club page)
export interface ClubMembershipDTO {
  isMember: boolean;
  isAdmin: boolean;
}

export interface ClubDetailDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  adminName: string;
  imageUrl?: string;
  membersCount: number;
  members: string[];
  membership: ClubMembershipDTO;
}

// Club post (list or single post)
export interface ClubPostDTO {
  id: number;
  clubId: number;
  authorUsername: string;
  content: string;
  createdAt: string;

  likes: number;
  dislikes: number;
  userReaction?: ReactionType;

  commentsCount: number;
  mediaUrls: string[];
}

// Reactions
export type ReactionType = 1 | -1;

// Request payloads
export interface ClubPostCreateRequest {
  content: string;
  mediaIds?: number[];
}

export interface ClubPostReactionRequest {
  reaction: ReactionType;
}