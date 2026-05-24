import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useUserAnimeDashboard } from "./hooks/useUserAnimeDashboard";
import DashboardHeader from "./components/DashboardHeader";
import AnimeWallView from "./components/wall/DashboardWallView";
import ViewModeSwitcher from "./components/ViewModeSwitcher";
import { WatchStatusEnum } from "../../api/enums";
import AnimeTimelineView from "./components/timeline/AnimeTimelineView";
import { DashboardViewMode } from "./types/dashboard";

export default function UserAnimeDashboardPage() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const { data, loading, list, filters, setFilters, updateAnime } = useUserAnimeDashboard(username);
  const [viewMode, setViewMode] = useState<DashboardViewMode>("wall");

  // check query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status") as WatchStatusEnum | null;

    if (status && Object.values(WatchStatusEnum).includes(status)) {
      setFilters((prev) => ({ ...prev, status }));
    }
  }, [location.search, setFilters]);

  if (loading) return <div className="text-gray-400 py-10 text-center">Loading dashboard…</div>;
  if (!data) return <div className="text-gray-500 py-10 text-center">User not found</div>;

  return (
    <div className="max-w-[1560px] mx-auto px-6 py-8 space-y-8">
      <DashboardHeader
        username={data.username}
        stats={{
          totalAnime: data.totalAnime,
          totalCompleted: data.list.filter(a => a.status === "Completed").length,
          totalWatching: data.list.filter(a => a.status === "Watching").length,
          totalPlanned: data.list.filter(a => a.status === "PlanToWatch").length,
          totalDropped: data.list.filter(a => a.status === "Dropped").length,
          totalOnHold: data.list.filter(a => a.status === "OnHold").length,
        }}
        isOwner={data.isOwner}
      />

      <ViewModeSwitcher viewMode={viewMode} onChange={setViewMode} />

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search anime..."
          className="px-3 py-1 rounded-lg bg-gray-800 text-white outline-none"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="px-3 py-1 rounded-lg bg-gray-800 text-white outline-none"
          value={filters.status || ""}
          onChange={(e) => {
            const val = Object.values(WatchStatusEnum).includes(e.target.value as WatchStatusEnum)
              ? (e.target.value as WatchStatusEnum)
              : undefined;
            setFilters({ ...filters, status: val });
          }}
        >
          <option value="">All statuses</option>
          <option value={WatchStatusEnum.Watching}>Watching</option>
          <option value={WatchStatusEnum.Completed}>Completed</option>
          <option value={WatchStatusEnum.Dropped}>Dropped</option>
          <option value={WatchStatusEnum.PlanToWatch}>Plan to Watch</option>
          <option value={WatchStatusEnum.OnHold}>On Hold</option>
        </select>
      </div>

      {/* Conditional view */}
      {viewMode === "wall" ? (
        <AnimeWallView list={list} isOwner={data.isOwner} onUpdateAnime={updateAnime} />
      ) : (
        <AnimeTimelineView list={list} isOwner={data.isOwner} onUpdateAnime={updateAnime} />
      )}
    </div>
  );
}
