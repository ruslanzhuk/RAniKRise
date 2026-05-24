import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser } from "../api/userApi";

/* ---------------- types ---------------- */

export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  themePreference: "light" | "dark";
  isBlocked: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

/* ---------------- context ---------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------- provider ---------------- */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const me = await getCurrentUser();

      setUser({
        id: me.id,
        username: me.username,
        email: me.email,
        avatarUrl: me.avatarUrl,
        themePreference: me.themePreference ?? "dark",
        isBlocked: me.isBlocked,
      });
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ---------------- hook ---------------- */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

