import { DashboardAnimeItem, UpdateAnimePayload } from "../../types/dashboard";
import DashboardAnimeCard from "./DashboardAnimeCard";

interface Props {
  list: DashboardAnimeItem[];
  isOwner: boolean;
  onUpdateAnime?: (payload: UpdateAnimePayload) => void;
}

export default function AnimeWallView({ list, isOwner, onUpdateAnime }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {list.map((anime) => (
        <DashboardAnimeCard
          key={anime.animeId}
          anime={anime}
          isOwner={isOwner}
          onUpdate={onUpdateAnime}
        />
      ))}
    </div>
  );
}
