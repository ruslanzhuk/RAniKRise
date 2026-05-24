import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendPreview } from "../../api/friendApi";
import { clubApi } from "../../api/clubApi";
import collectionApi from "../../api/collectionApi";
import type { ClubDetailDTO } from "../../api/types/club.types";
import type { FriendPreviewDto } from "../../api/types/friends.types";
import type from "../../api/collectionApi";
import type { CollectionDTO } from "../../api/types/collection.types";
import defaultAvatar from "assets/images/default_avatar_7665.png";
import defaultAnimePoster from "assets/images/anime_poster_default.png";

interface Props {
  userId: string;
  username: string;
}

export default function ProfileSocial({ userId, username }: Props) {
  const [friends, setFriends] = useState<FriendPreviewDto[]>([]);
  const [clubs, setClubs] = useState<ClubDetailDTO[]>([]);
  const [favorites, setFavorites] = useState<CollectionDTO | null>(null);

  useEffect(() => {
    // Friends
    getFriendPreview(userId).then(setFriends);

    // Clubs
    clubApi.getUserClubs(userId).then(setClubs);

    // Favorites
    collectionApi.getFavorites().then(setFavorites);
  }, [userId]);

  const firstFourFriends = friends.slice(0, 4);
  const firstThreeClubs = clubs.slice(0, 3);
  const firstSixFavorites: CollectionDTO["animes"] = favorites?.animes.slice(0, 6) ?? [];

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      {/* FRIENDS */}
      <Box title="Friends">
        {friends.length === 0 ? (
          <p className="text-gray-500 text-sm">No friends yet</p>
        ) : (
          <div className="flex items-center gap-2">
            {firstFourFriends.map((friend) => (
              <Link key={friend.id} to={`/user/${friend.username}`}>
                <img
                  src={friend.avatarUrl || defaultAvatar}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full border-2 border-gray-900 hover:scale-110 transition"
                />
              </Link>
            ))}
            {friends.length > 4 && (
              <Link
                to={`/user/${username}/friends`}
                className="text-sm text-blue-400 hover:underline ml-2"
              >
                +{friends.length - 4} more
              </Link>
            )}
          </div>
        )}
      </Box>

      {/* CLUBS */}
      <Box title="Clubs">
        {clubs.length === 0 ? (
          <p className="text-gray-500 text-sm">No clubs yet</p>
        ) : (
          <div className="flex flex-col gap-1">
            {firstThreeClubs.map((club) => (
              <Link
                key={club.id}
                to={`/clubs/${club.id}`}
                className="text-sm text-blue-400 hover:underline truncate block"
                title={club.name}
              >
                {club.name}
              </Link>
            ))}
            {clubs.length > 3 && (
              <Link
                to={`/user/${username}/clubs`}
                className="text-sm text-blue-400 hover:underline mt-1"
              >
                +{clubs.length - 3} more
              </Link>
            )}
          </div>
        )}
      </Box>

      {/* FAVORITES */}
      <Box title="Favorites">
        {favorites?.animes.length === 0 ? (
          <p className="text-gray-500 text-sm">No favorite anime yet</p>
        ) : (
          <div className="flex items-center gap-1 flex-wrap">
            {firstSixFavorites.map((anime) => (
              <Link key={anime.id} to={`/anime/${anime.id}`}>
                <img
                  src={anime.imageUrl || defaultAnimePoster}
                  alt={anime.title}
                  className="w-8 h-8 rounded border border-gray-700 hover:scale-110 transition"
                  title={anime.title}
                />
              </Link>
            ))}
            {favorites && favorites.animes.length > 6 && (
              <Link
                to={`/user/${username}/favorites`}
                className="text-sm text-blue-400 hover:underline ml-2"
              >
                +{favorites.animes.length - 6} more
              </Link>
            )}
          </div>
        )}
      </Box>
    </div>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="text-gray-400">{children}</div>
    </div>
  );
}
