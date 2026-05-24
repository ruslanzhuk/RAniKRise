import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFriendPreview } from "../../api/friendApi";
import type { FriendPreviewDto } from "../../api/types/friends.types";
import defaultAvatar from "assets/images/default_avatar_7665.png";

export default function FriendsList() {
  const { userId } = useParams<{ userId: string }>();
  const [friends, setFriends] = useState<FriendPreviewDto[]>([]);

  useEffect(() => {
    if (!userId) return;
    getFriendPreview(userId).then(setFriends);
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      {friends.length === 0 && <p className="text-gray-400">No friends yet</p>}
      <div className="grid grid-cols-4 gap-4">
        {friends.map((friend) => (
          <Link key={friend.id} to={`/user/${friend.username}`} className="flex flex-col items-center">
            <img
              src={friend.avatarUrl || defaultAvatar}
              alt={friend.username}
              className="w-16 h-16 rounded-full border-2 border-gray-900"
            />
            <span className="mt-1 text-sm">{friend.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
