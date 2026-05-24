import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const tabs = [
  { label: "All", to: "" },
  { label: "Anime", to: "anime" },
  { label: "Posts", to: "posts" },
  { label: "Club Posts", to: "club-posts" },
  { label: "User Pages", to: "users" },
];

const CommentManagerHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Comment Manager</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded font-semibold ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CommentManagerHome;
