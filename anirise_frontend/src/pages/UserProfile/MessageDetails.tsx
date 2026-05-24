import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  NotificationDto,
} from "../../api/notificationApi";
import { acceptFriendRequest, rejectFriendRequest } from "../../api/friendApi";

export default function MessageDetails() {
  const { id, username } = useParams<{ id: string; username: string }>();
  const [notification, setNotification] = useState<NotificationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      const notifications = await getNotifications();
      const found = notifications.find(n => n.id === Number(id));
      if (!found) {
        return;
      }
      setNotification(found);

      if (!found.isRead) {
        await markNotificationAsRead(found.id);
        setNotification(prev => prev ? { ...prev, isRead: true } : prev);
      }

      setLoading(false);
    };

    fetchNotification();
  }, [id]);

  const handleAccept = async () => {
    if (!notification || processing || response) return;
    setProcessing(true);
    try {
      await acceptFriendRequest(notification.referenceId as unknown as number);
      setResponse("accepted");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!notification || processing || response) return;
    setProcessing(true);
    try {
      await rejectFriendRequest(notification.referenceId as unknown as number);
      setResponse("rejected");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Loading message…</div>;
  }

  if (!notification) {
    return <div className="text-center text-red-400 py-20">Message not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div>
        <Link
          to={`/user/${username}/notifications`}
          className="text-blue-400 hover:underline flex items-center gap-1"
        >
          ← Back to messages
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Message Details</h1>

      <div
        className={`p-4 rounded-lg ${
          notification.isRead ? "bg-gray-800" : "bg-green-700/30"
        }`}
      >
        <p className="mb-2">{notification.message}</p>
        <span className="text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>

      {notification.type === "FriendRequest" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAccept}
            disabled={!!response || processing}
            className={`px-4 py-2 rounded text-white transition
              ${response === "accepted" ? "bg-green-500" : ""}
              ${response && response !== "accepted" ? "bg-gray-700 border border-blue-400 text-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            disabled={!!response || processing}
            className={`px-4 py-2 rounded text-white transition
              ${response === "rejected" ? "bg-red-500" : ""}
              ${response && response !== "rejected" ? "bg-gray-700 border border-blue-400 text-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
