import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AdminAuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AdminLoginResponse {
  token: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const http = axios.create({ baseURL: "http://localhost:5000/api" });

  http.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  // Token verification at startup
  const verifyAdmin = async (): Promise<boolean> => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setIsAdmin(false);
      setIsLoading(false);
      return false;
    }

    try {
      await http.get("/admin/verify");
      setIsAdmin(true);
      return true;
    } catch {
      localStorage.removeItem("adminToken");
      setIsAdmin(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await http.post<AdminLoginResponse>("/admin/login", { email, password });
      const { token } = res.data;

      localStorage.setItem("adminToken", token);

      const isAdminVerified = await verifyAdmin();
      if (!isAdminVerified) return false;

      navigate("/xkey/broadmin/dashboard");
      return true;
    } catch {
      localStorage.removeItem("adminToken");
      setIsAdmin(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    navigate("/xkey/broadmin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
