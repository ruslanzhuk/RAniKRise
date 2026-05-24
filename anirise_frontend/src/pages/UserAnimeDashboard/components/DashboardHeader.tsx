import { Link } from "react-router-dom";
import { UserStats } from "../../../api/animeApi";
import { Lock } from "lucide-react";

interface Props {
  username: string;
  stats: UserStats;
  isOwner: boolean;
}

export default function DashboardHeader({
  username,
  stats,
  isOwner,
}: Props) {
  const completionPercent =
    stats.totalAnime > 0
      ? Math.round((stats.totalCompleted / stats.totalAnime) * 100)
      : 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 space-y-6 shadow-lg">
      {/* Top: username + owner badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {username}
            <span className="text-purple-400">Dashboard</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {stats.totalAnime} anime · {stats.totalCompleted} completed
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <Lock size={14} />
            Owner
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Completion</span>
          <span>{completionPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-lime-400 transition-all duration-700 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <Stat label="Watching" value={stats.totalWatching} color="blue" />
        <Stat label="Completed" value={stats.totalCompleted} color="green" />
        <Stat label="Planned" value={stats.totalPlanned} color="yellow" />
        <Stat label="Dropped" value={stats.totalDropped} color="red" />
        <Stat label="On Hold" value={stats.totalOnHold} color="purple" />
      </div>

      {/* Link to profile */}
      <div className="flex justify-end">
        <Link
          to={`/user/${username}`}
          className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors"
        >
          View profile →
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className={`bg-gray-800/60 rounded-xl py-3 transform hover:scale-105 transition-transform duration-300 cursor-default`}
      title={label}
    >
      <div className={`text-xl font-bold text-${color}-400`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}
