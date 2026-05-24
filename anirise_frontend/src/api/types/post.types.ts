export interface PostAuthorDTO {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export interface PostResponseDTO {
  id: number;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt?: string | null;
  author: PostAuthorDTO;
}

export interface PostCreateDTO {
  content: string;
  mediaUrls?: string[];
}

export interface PostUpdateDTO {
  content?: string;
  mediaUrls?: string[];
}
