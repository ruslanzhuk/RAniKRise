import React, { useState, useRef, useContext, forwardRef } from "react";
import { Menu, Search, Mail } from "lucide-react";
import defaultAvatar from "../../assets/images/default_avatar_7665.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import UserMenu from "./UserMenu";
import DetectionButton from "./DetectionButton";
import MessagesButton from "../MessagesButton/MessagesButton";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ isOpen, toggleSidebar }, ref) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [searchType, setSearchType] = useState("all");
    const [query, setQuery] = useState("");

    const searchTypes = [
      { label: "All", value: "all" },
      { label: "Anime", value: "anime" },
      { label: "Characters", value: "characters" },
      { label: "Users", value: "users" },
      { label: "Clubs", value: "clubs" },
      { label: "Authors", value: "authors" },
      { label: "Studios", value: "studios" },
      { label: "News", value: "news" }
    ];

    const handleSearch = () => {
      if (!query.trim()) return;

      navigate(`/search?type=${searchType}&query=${encodeURIComponent(query)}`);
      setQuery("");
    };

    const handleLogout = () => {
      logout();
      setMenuOpen(false);
      navigate("/login");
    };

    return (
      <header
        ref={ref}
        className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-[999] h-16"
      >
        {/* Burger Button */}
        <button
          onClick={toggleSidebar}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-purple-700 transition z-10"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Menu size={24} />
          </motion.div>
        </button>

        <div className="w-full px-4 py-3 flex items-center justify-between z-999">
          {/* Logo */}
          <div className="flex items-center pl-16 flex-shrink-0">
            <NavLink
              to="/"
              className="text-3xl font-bold tracking-wide hover:text-purple-400 transition"
            >
              RAniKRise
            </NavLink>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0 mx-12 max-w-6xl flex gap-2 items-center">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
            >
              {searchTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search anything..."
                className="w-full rounded-full py-2 px-4 pl-10 bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500"
              />
              <Search
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>

            {/* New Detection Button */}
            <DetectionButton onClick={() => navigate("/detection")}>
              Character Detection
            </DetectionButton>
          </div>

          {/* User section */}
          <div className="flex items-center space-x-6 ml-4 flex-shrink-0">
            {user ? (
              <>
                <MessagesButton username={user.username} />

                <div
                  ref={wrapperRef}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <img
                    src={user.avatarUrl || defaultAvatar}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>

                  <UserMenu
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    onLogout={handleLogout}
                    wrapperRef={wrapperRef}
                    user={user}
                  />
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }
);

export default Header;