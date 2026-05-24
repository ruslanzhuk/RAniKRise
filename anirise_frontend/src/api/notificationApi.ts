import http from "./http";

export type NotificationType = "FriendRequest" | "FriendAccepted" | "System" | "Warning";

export interface NotificationDto {
  id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType;
  referenceId?: number | null;
}

export const getNotifications = () =>
  http.get<NotificationDto[]>("/notifications").then(res => res.data);

export const markNotificationAsRead = async (id: number) => {
  try {
    const res = await http.post(`/notifications/${id}/read`);
    return res.status === 200;
  } catch (err) {
    console.error("Failed to mark as read", err);
    return false;
  }
};
