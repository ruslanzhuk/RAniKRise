import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { getNotifications } from "../../api/notificationApi";
import { Link } from "react-router-dom";

interface Props {
  username: string;
}

export default function MessagesButton({ username }: Props) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await getNotifications();
      const count = notifications.filter(n => !n.isRead).length;
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayCount = unreadCount > 9 ? "9+" : unreadCount;

  return (
    <div className="relative group">
      <Link
        to={`/user/${username}/notifications`}
        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 inline-flex items-center justify-center"
      >
        <Mail size={20} className="text-white transition" />
      </Link>

      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition">
          {displayCount}
        </span>
      )}

      <div
        className="absolute right-full mr-2 top-1/2 -translate-y-1/2
          bg-white text-black text-xs px-2 py-1 rounded opacity-0
          group-hover:opacity-100 transition pointer-events-none"
      >
        Messages
      </div>
    </div>
  );
}
