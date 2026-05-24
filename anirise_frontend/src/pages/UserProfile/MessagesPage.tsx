import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationAsRead, NotificationDto } from "../../api/notificationApi";
import { useAuth } from "../../context/AuthContext";

export default function MessagesPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) return <div className="text-gray-400 py-20 text-center">Loading messages…</div>;
  if (!user) return <div className="text-gray-400 py-20 text-center">Please login to view messages</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {notifications.length === 0 && <p className="text-gray-500">No messages yet</p>}

      {notifications.map(n => (
        <Link
          key={n.id}
          to={`/user/${user.username}/notifications/${n.id}`}
          className="block"
        >
          <div
            className={`p-4 rounded-lg flex justify-between items-center ${
              n.isRead ? "bg-gray-800" : "bg-green-700/30"
            } hover:bg-gray-700 transition`}
          >
            <div>
              <p>{n.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>

            {!n.isRead && (
              <button
                onClick={(e) => handleMarkAsRead(e, n.id)}
                className="ml-4 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 rounded text-white"
              >
                Mark as read
              </button>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
