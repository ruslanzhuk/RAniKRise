import { Link } from "react-router-dom";
import { useState } from "react";
import { DashboardAnimeItem, UpdateAnimePayload } from "../../types/dashboard";
import { WatchStatusEnum } from "../../../../api/enums";
import { Star } from "lucide-react";

interface Props {
  anime: DashboardAnimeItem;
  isOwner: boolean;
  onUpdate?: (payload: UpdateAnimePayload) => void;
}

const STATUS_LABELS: Record<WatchStatusEnum, string> = {
  [WatchStatusEnum.Watching]: "Watching",
  [WatchStatusEnum.Completed]: "Completed",
  [WatchStatusEnum.Dropped]: "Dropped",
  [WatchStatusEnum.PlanToWatch]: "Plan to Watch",
  [WatchStatusEnum.OnHold]: "On Hold",
};

const STATUS_STYLES: Record<WatchStatusEnum, string> = {
  [WatchStatusEnum.Watching]: "bg-blue-500 text-white",
  [WatchStatusEnum.Completed]: "bg-green-500 text-white",
  [WatchStatusEnum.Dropped]: "bg-red-500 text-white",
  [WatchStatusEnum.PlanToWatch]: "bg-yellow-400 text-black",
  [WatchStatusEnum.OnHold]: "bg-purple-500 text-white",
};

const STATUS_BG_FADED: Record<WatchStatusEnum, string> = {
  [WatchStatusEnum.Watching]: "bg-blue-400/70",
  [WatchStatusEnum.Completed]: "bg-green-400/70",
  [WatchStatusEnum.Dropped]: "bg-red-400/70",
  [WatchStatusEnum.PlanToWatch]: "bg-yellow-400/70",
  [WatchStatusEnum.OnHold]: "bg-purple-400/70",
};

export default function DashboardAnimeCard({ anime, isOwner, onUpdate }: Props) {
  const [hover, setHover] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStatusChange = (status: WatchStatusEnum) => {
    if (!isOwner || !onUpdate) return;

    if (anime.status === status) return;

    onUpdate({ animeId: anime.animeId, status });
  };

  const handleRatingClick = (score: number) => {
    if (!isOwner || !onUpdate) return;
    onUpdate({ animeId: anime.animeId, rating: score });
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-md hover:scale-105 transform transition-all duration-300 relative w-[205px] p-[5px_9px] ${STATUS_BG_FADED[anime.status]}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setHoverRating(null); }}
    >
      {/* Poster */}
      <div className="w-full relative mx-auto" style={{ paddingTop: "132%" }}>
        <img
          src={anime.coverImage || "/assets/images/not_found.png"}
          alt={anime.title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
        />
        {isOwner && hover && (
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center gap-1 p-1 rounded-t-lg">
            {/* Статуси */}
            <div className="flex flex-wrap justify-center gap-1">
              {Object.values(WatchStatusEnum).map((status) => (
                <button
                  key={status}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full shadow-md transition
                    ${anime.status === status ? STATUS_STYLES[status] : "bg-gray-700 text-gray-300 hover:brightness-110"}`}
                  onClick={() => handleStatusChange(status)}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            {/* Зірочки */}
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <Star
                  key={n}
                  size={12}
                  className={`cursor-pointer transition-colors ${
                    (hoverRating ?? anime.rating ?? 0) >= n ? "text-yellow-400" : "text-gray-500"
                  }`}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => handleRatingClick(n)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Title + rating */}
      <div className="mt-1 p-3 flex flex-col gap-1 bg-gray-800 rounded-b-lg">
        <Link
            to={`/anime/${anime.animeId}`}
            className="font-semibold text-sm truncate text-center hover:underline"
        >
            {anime.title}
        </Link>

        {!isOwner && anime.rating && (
            <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs">
            <Star size={12} />
            <span>{anime.rating}/10</span>
            </div>
        )}
        {!isOwner && (
            <p className="text-xs text-gray-300 text-center truncate">{STATUS_LABELS[anime.status]}</p>
        )}
      </div>
    </div>
  );
}
