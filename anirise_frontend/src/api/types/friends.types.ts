export type FriendshipStatus =
  | "none"
  | "outgoing"
  | "incoming"
  | "friends"
  | "blocked";

export interface FriendPreviewDto {
  id: string;
  username: string;
  avatarUrl?: string;
}
