import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useEffect, useState } from "react";
import { AdminProfileDto } from "../../../api/types/adminAll.types";
import { getAdminProfile } from "../../../api/adminApi";

const navItem = "block px-4 py-2 rounded hover:bg-yellow-100 transition";
const active = "bg-yellow-200 font-semibold";
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `${navItem} ${isActive ? active : ""}`;

const AdminSidebar = () => {
  const { logout } = useAdminAuth();
  const [profile, setProfile] = useState<AdminProfileDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <NavLink
          to="/xkey/broadmin/profile"
          className="flex items-center mb-6 space-x-3 cursor-pointer rounded p-2 hover:bg-yellow-100 transition"
        >
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              {profile?.username?.charAt(0).toUpperCase() || "A"}
            </div>
          )}

          <div className="text-sm font-semibold text-gray-900">
            {profile?.username || "Admin"}
          </div>
        </NavLink>

        <nav className="space-y-1 text-sm text-gray-900">
          <NavLink
            to="/xkey/broadmin/dashboard"
            className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink to="/xkey/broadmin/anime" className={navItem}>
            Anime manager
          </NavLink>
          <NavLink
            to="/xkey/broadmin/anime/import"
            className={linkClass}
          >
            Anime import (Jikan)
          </NavLink>
          <NavLink to="/xkey/broadmin/clubs" className={navItem}>
            Clubs
          </NavLink>
          <NavLink to="/xkey/broadmin/posts" className={navItem}>
            Club posts
          </NavLink>
          <NavLink to="/xkey/broadmin/news" className={navItem}>
            News
          </NavLink>
          <NavLink to="/xkey/broadmin/home-announcements" className={navItem}>
            Home announcements
          </NavLink>
          <NavLink
            to="/xkey/broadmin/media"
            className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}
          >
            Media manager
          </NavLink>
          <NavLink
            to="/xkey/broadmin/comments"
            className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}
          >
            Comment manager
          </NavLink>
        </nav>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
