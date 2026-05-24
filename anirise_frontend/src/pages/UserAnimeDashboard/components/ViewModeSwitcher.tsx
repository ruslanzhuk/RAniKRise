import React from "react";
import { DashboardViewMode } from "../types/dashboard";
import { Grid, Clock, BarChart2 } from "lucide-react";

interface Props {
  viewMode: DashboardViewMode;
  onChange: (mode: DashboardViewMode) => void;
}

/**
 * Switcher for dashboard view modes: Wall, Timeline, Stats
 */
export default function ViewModeSwitcher({ viewMode, onChange }: Props) {
  const buttons: { mode: DashboardViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "wall", icon: <Grid size={16} />, label: "Wall" },
    { mode: "timeline", icon: <Clock size={16} />, label: "Timeline" },
    { mode: "stats", icon: <BarChart2 size={16} />, label: "Stats" },
  ];

  return (
    <div className="flex gap-2 bg-gray-900 p-2 rounded-lg border border-gray-800">
      {buttons.map(({ mode, icon, label }) => {
        const active = mode === viewMode;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            aria-label={`Switch to ${label} view`}
            className={`
              flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition
              ${active 
                ? "bg-purple-600 text-white shadow-lg ring-1 ring-purple-400" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
            `}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}
