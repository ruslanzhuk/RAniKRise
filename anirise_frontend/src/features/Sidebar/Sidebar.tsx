import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Film, Users, Newspaper, HelpCircle, Info, Share2 , Network} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isAnimeOpen, setIsAnimeOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      setIsAnimeOpen(false);
      setIsIndustryOpen(false);

      if (location.pathname.startsWith("/anime/")) {
        setIsAnimeOpen(true);
      } else if (location.pathname.startsWith("/industry/")) {
        setIsIndustryOpen(true);
      }
    }
  }, [isOpen, location.pathname]);

  const contentVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const quickIcons = [
    { to: "/anime/full-list", icon: Film, key: "anime", title: "Anime" },
    { to: "/clubs/join", icon: Network, key: "clubs", title: "Clubs" },
    { to: "/users", icon: Users, key: "users", title: "Users" },
    { to: "/industry/news", icon: Newspaper, key: "industry", title: "News" },
    { to: "/help", icon: HelpCircle, key: "help", title: "Help" },
    { to: "/about", icon: Info, key: "about", title: "About" },
    { to: "/social", icon: Share2, key: "social", title: "Social" },
  ];

  return (
    <>
      {!isOpen && (
        <motion.aside
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-gray-900 text-white z-30 shadow-lg"
          initial={false}
          animate={{ x: 0 }}
        >
          <div className="flex flex-col items-center space-y-4 p-4 pt-4">
            {quickIcons.map(({ to, icon: Icon, key, title }) => (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) =>
                  `flex justify-center items-center w-12 h-12 rounded-lg hover:bg-purple-600 transition ${
                    isActive ? "bg-purple-600" : ""
                  }`
                }
                title={title}
              >
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Icon size={20} />
                </motion.div>
              </NavLink>
            ))}
          </div>
        </motion.aside>
      )}

      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white z-50 shadow-2xl overflow-y-auto" // top-16 під header, z-50 поверх overlay
        >
          <motion.nav
            variants={contentVariants}
            initial="closed"
            animate="open"
            className="p-6 space-y-2"
          >
            {/* Anime Section */}
            <div>
              <button
                onClick={() => setIsAnimeOpen(!isAnimeOpen)}
                className="flex items-center w-full p-2 rounded-lg hover:bg-purple-600 transition"
              >
                <Film size={20} className="mr-2" />
                <span>Anime</span>
                {isAnimeOpen ? (
                  <ChevronDown size={16} className="ml-auto" />
                ) : (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </button>
              {isAnimeOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="ml-6 space-y-1"
                >
                  <NavLink
                    to="/anime/full-list"
                    className={({ isActive }) =>
                      `block p-2 rounded-lg hover:bg-purple-500 transition ${
                        isActive ? "bg-purple-600" : ""
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    Full list
                  </NavLink>
                  <NavLink
                    to="/anime/popular"
                    className={({ isActive }) =>
                      `block p-2 rounded-lg hover:bg-purple-500 transition ${
                        isActive ? "bg-purple-600" : ""
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    Popular Anime
                  </NavLink>
                  <NavLink
                    to="/anime/new"
                    className={({ isActive }) =>
                      `block p-2 rounded-lg hover:bg-purple-500 transition ${
                        isActive ? "bg-purple-600" : ""
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    New Releases
                  </NavLink>
                </motion.div>
              )}
            </div>

            {/* Clubs */}
            <NavLink
              to="/clubs/join"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-purple-600 transition ${
                  isActive ? "bg-purple-600" : ""
                }`
              }
              onClick={toggleSidebar}
            >
              <Network size={20} className="mr-2" />
              <span>Clubs</span>
            </NavLink>

            {/* Users Section */}
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-purple-600 transition ${
                  isActive ? "bg-purple-600" : ""
                }`
              }
              onClick={toggleSidebar}
            >
              <Users size={20} className="mr-2" />
              <span>Users</span>
            </NavLink>

            {/* Industry Section */}
            <div>
              <button
                onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                className="flex items-center w-full p-2 rounded-lg hover:bg-purple-600 transition"
              >
                <Newspaper size={20} className="mr-2" />
                <span>Industry</span>
                {isIndustryOpen ? (
                  <ChevronDown size={16} className="ml-auto" />
                ) : (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </button>
              {isIndustryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="ml-6 space-y-1"
                >
                  <NavLink
                    to="/industry/news"
                    className={({ isActive }) =>
                      `block p-2 rounded-lg hover:bg-purple-500 transition ${
                        isActive ? "bg-purple-600" : ""
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    News
                  </NavLink>
                  <NavLink
                    to="/industry/characters"
                    className={({ isActive }) =>
                      `block p-2 rounded-lg hover:bg-purple-500 transition ${
                        isActive ? "bg-purple-600" : ""
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    Characters
                  </NavLink>
                  <NavLink
                    to="/industry/studios"
                    className={({ isActive }) =>
                      `block p-2 rounded-lg hover:bg-purple-500 transition ${
                        isActive ? "bg-purple-600" : ""
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    Studios
                  </NavLink>
                </motion.div>
              )}
            </div>

            {/* Help Section */}
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-purple-600 transition ${
                  isActive ? "bg-purple-600" : ""
                }`
              }
              onClick={toggleSidebar}
            >
              <HelpCircle size={20} className="mr-2" />
              <span>Help</span>
            </NavLink>

            {/* About Section */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-purple-600 transition ${
                  isActive ? "bg-purple-600" : ""
                }`
              }
              onClick={toggleSidebar}
            >
              <Info size={20} className="mr-2" />
              <span>About</span>
            </NavLink>

            {/* Social Media Section */}
            <NavLink
              to="/social"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg hover:bg-purple-600 transition ${
                  isActive ? "bg-purple-600" : ""
                }`
              }
              onClick={toggleSidebar}
            >
              <Share2 size={20} className="mr-2" />
              <span>Social Media</span>
            </NavLink>
          </motion.nav>
        </motion.div>
      )}
    
    </>
  );
};

export default Sidebar;