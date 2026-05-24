import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getUserAnimeList,
  UserAnimeListItemDTO,
} from "../../api/userAnimePublicApi";
import { WatchStatusEnum } from "../../api/enums";
import defaultCover from "assets/images/not_found.png";

export default function UserAnimeListPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const rawStatus = searchParams.get("status");

  const statusParam = Object.values(WatchStatusEnum).includes(
    rawStatus as WatchStatusEnum
  )
    ? (rawStatus as WatchStatusEnum)
    : null;

  const [list, setList] = useState<UserAnimeListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    getUserAnimeList(username, statusParam ?? undefined)
      .then(setList)
      .finally(() => setLoading(false));
  }, [username, statusParam]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {username}'s anime list
        {statusParam && ` · ${statusParam}`}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {list.map((anime) => (
          <div
            key={anime.animeId}
            className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
          >
            <img
              src={anime.coverImage || defaultCover}
              alt={anime.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-2 text-sm font-medium truncate">
              {anime.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
