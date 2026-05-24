import React from "react";
import { useTheme } from "../../context/ThemeContext";

const themes = [
  {
    key: "light",
    title: "Light",
    description: "Bright interface for daytime use",
  },
  {
    key: "dark",
    title: "Dark",
    description: "Comfortable for night sessions",
  },
] as const;

const InterfaceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Interface theme</h2>
      <p className="text-sm text-gray-400">
        Choose how AniRise looks for you. This setting is saved to your account.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((t) => {
          const active = theme === t.key;

          return (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`
                relative p-4 rounded-xl border transition
                ${active
                  ? "border-purple-500 ring-2 ring-purple-500/40"
                  : "border-gray-600 hover:border-purple-400"}
              `}
            >
              <div className="flex flex-col items-start space-y-1">
                <span className="font-medium">{t.title}</span>
                <span className="text-xs text-gray-400">{t.description}</span>
              </div>

              {active && (
                <span className="absolute top-2 right-2 text-xs text-purple-400">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterfaceSettings;
