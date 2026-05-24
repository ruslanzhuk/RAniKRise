import { useEffect, useState } from "react";
import { UserStats } from "../../api/animeApi";
import { ProfileHeaderUser } from "../../api/types/profile";
import defaultAvatar from "assets/images/default_avatar_7665.png";
import { Mail, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import type { FriendshipStatus } from "../../api/types/friends.types";
import MessagesButton from "../../features/MessagesButton/MessagesButton";

import {
  getFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../api/friendApi";

type Props = {
  user: ProfileHeaderUser;
  stats: UserStats | null;
  isOwner: boolean;
};

const STATUS_LABELS: Record<string, string> = {
  Watching: "Watching",
  Completed: "Completed",
  Dropped: "Dropped",
  PlanToWatch: "Plan to Watch",
  OnHold: "On Hold",
};

export default function ProfileHeader({ user, stats, isOwner }: Props) {
  const [friendStatus, setFriendStatus] = useState<FriendshipStatus>("none");
  const [loadingFriend, setLoadingFriend] = useState(false);

  const canSeePrivateInfo =
    isOwner || friendStatus === "friends" || user.visibility === "Public";

  const age =
    canSeePrivateInfo && user.birthDate
      ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
      : null;

  useEffect(() => {
    if (!isOwner) {
      getFriendshipStatus(user.id).then(setFriendStatus);
    }
  }, [user.id, isOwner]);

  const handleFriendClick = async () => {
    if (loadingFriend) return;
    setLoadingFriend(true);
    try {
      if (friendStatus === "none") {
        await sendFriendRequest(user.id);
        setFriendStatus("outgoing");
      } else if (friendStatus === "incoming") {
        await acceptFriendRequest(user.id as unknown as number);
        setFriendStatus("friends");
      }
    } finally {
      setLoadingFriend(false);
    }
  };

  const getFriendButtonLabel = () => {
    switch (friendStatus) {
      case "none":
        return "Add Friend";
      case "outgoing":
        return "Request Sent";
      case "incoming":
        return "Accept Friend";
      case "friends":
        return "Friends";
      case "blocked":
        return "Blocked";
    }
  };

  const getFriendButtonClass = () => {
    switch (friendStatus) {
      case "none":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "outgoing":
        return "bg-gray-700 text-white cursor-not-allowed";
      case "incoming":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "friends":
        return "bg-green-500 text-white cursor-not-allowed";
      case "blocked":
        return "bg-red-500 text-white cursor-not-allowed";
    }
  };

  const totalAnime = stats?.totalAnime ?? 0;
  const completedCount = stats?.totalCompleted ?? 0;

  return (
    <div className="bg-gray-900 rounded-xl p-6 flex gap-6">
      {/* AVATAR + FRIEND BUTTON */}
      <div className="relative">
        <img
          src={user.avatarUrl || defaultAvatar}
          className="w-32 h-32 object-cover rounded-lg border border-gray-700"
        />
        {!isOwner && (
          <button
            onClick={handleFriendClick}
            disabled={loadingFriend || friendStatus === "outgoing" || friendStatus === "friends"}
            className={`absolute bottom-0 left-0 w-full py-1 text-sm rounded-b-lg transition ${getFriendButtonClass()}`}
          >
            {getFriendButtonLabel()}
          </button>
        )}
      </div>

      {/* INFO */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-400 mt-1 flex flex-wrap gap-2">
          {canSeePrivateInfo && age && (
            <span>🎂 {age} years old</span>
          )}

          {canSeePrivateInfo && user.gender && (
            <span>⚥ {user.gender}</span>
          )}

          <span>
            Joined on{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"}
          </span>
        </p>

        {user.visibility === "Private" && !canSeePrivateInfo && (
          <p className="text-sm text-gray-500 mt-2 italic">
            This profile is private. Only friends can see personal details.
          </p>
        )}

        {/* ANIME BAR */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <Link
              to={`/user/${user.username}/anime`}
              className="text-blue-400 hover:underline"
            >
              Anime list
            </Link>
            <span>{completedCount} / {totalAnime} watched</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-blue-500/40">
            <div
              className="h-full bg-green-500"
              style={{ width: totalAnime ? `${(completedCount / totalAnime) * 100}%` : "0%" }}
            />
            <p className="text-xs text-gray-400 mt-1">
              Completed {completedCount} of {totalAnime} anime
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      {isOwner && (
        <div className="flex flex-col gap-3">
          <MessagesButton username={user.username} />
          <IconButton
            icon={<Settings size={20} />}
            label="Settings"
            to={`/user/${user.username}/settings`}
          />
        </div>
      )}
    </div>
  );
}


function IconButton({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <div className="relative group">
      <Link
        to={to}
        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center justify-center"
      >
        {icon}
      </Link>
      <div
        className="absolute right-full mr-2 top-1/2 -translate-y-1/2
          bg-white text-black text-xs px-2 py-1 rounded opacity-0
          group-hover:opacity-100 transition pointer-events-none"
      >
        {label}
      </div>
    </div>
  );
}