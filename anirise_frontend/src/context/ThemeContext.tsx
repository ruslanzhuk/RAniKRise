import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { updateTheme } from "../api/userApi";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshUser } = useAuth();

  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    if (user?.themePreference) {
      setThemeState(user.themePreference);
      document.documentElement.setAttribute(
        "data-theme",
        user.themePreference
      );
    }
  }, [user?.themePreference]);

  const setTheme = async (newTheme: Theme) => {
    if (!user || newTheme === theme) return;

    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    await updateTheme(newTheme);

    await refreshUser();
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
