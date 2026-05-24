import http from "./http";
import type { FriendshipStatus, FriendPreviewDto } from "./types/friends.types";

export const getFriendshipStatus = async (userId: string): Promise<FriendshipStatus> => {
  const res = await http.get<FriendshipStatus>(`/friends/status/${userId}`);
  return res.data;
};

export const sendFriendRequest = async (userId: string): Promise<void> => {
  await http.post(`/friends/request/${userId}`);
};

export const acceptFriendRequest = async (id: number): Promise<void> => {
  await http.post(`/friends/${id}/accept`);
};

export const rejectFriendRequest = async (id: number): Promise<void> => {
  await http.post(`/friends/${id}/reject`);
};

export const getFriendPreview = async (userId: string): Promise<FriendPreviewDto[]> => {
  const res = await http.get<FriendPreviewDto[]>(`/friends/preview/${userId}`);
  return res.data;
};
