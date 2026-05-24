import { DashboardAnimeItem, UpdateAnimePayload } from "../../types/dashboard";
import { useAnimeEdit } from "../../hooks/useAnimeEdit";
import { WatchStatusEnum } from "../../../../api/enums";

interface Props {
  list: DashboardAnimeItem[];
  isOwner: boolean;
  onUpdateAnime?: (payload: UpdateAnimePayload) => void;
}

export default function AnimeTimelineView({ list, isOwner, onUpdateAnime }: Props) {
  const { setRating, setStatus } = useAnimeEdit(onUpdateAnime ?? (() => {}));

  // Sort by updatedAt descending, fallback to animeId
  const sortedList = [...list].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA || a.animeId - b.animeId;
  });

  return (
    <div className="space-y-4">
      {sortedList.map((anime) => (
        <div key={anime.animeId} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-lg">{anime.title}</div>
            <div className="text-sm text-gray-400">
              {anime.updatedAt ? new Date(anime.updatedAt).toLocaleDateString() : "Unknown date"} · {anime.status}
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              {/* Rating input */}
              <input
                type="number"
                min={1}
                max={10}
                placeholder="-"
                value={anime.rating ?? ""}
                onChange={(e) => setRating(anime.animeId, e.target.value ? Number(e.target.value) : null)}
                className="w-16 px-2 py-1 rounded-lg bg-gray-800 text-white text-sm text-center outline-none"
              />

              {/* Status select */}
              <select
                value={anime.status}
                onChange={(e) => setStatus(anime.animeId, e.target.value as WatchStatusEnum)}
                className="px-2 py-1 rounded-lg bg-gray-800 text-white text-sm outline-none"
              >
                <option value={WatchStatusEnum.Watching}>Watching</option>
                <option value={WatchStatusEnum.Completed}>Completed</option>
                <option value={WatchStatusEnum.Dropped}>Dropped</option>
                <option value={WatchStatusEnum.PlanToWatch}>Plan to Watch</option>
                <option value={WatchStatusEnum.OnHold}>On Hold</option>
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
