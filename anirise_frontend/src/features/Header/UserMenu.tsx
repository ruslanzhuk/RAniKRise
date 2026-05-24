import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { User as UserIcon, Users, Settings, List, LogOut, Sparkles } from "lucide-react";
import { User } from "../../context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  user: User | null;
}

const UserMenu: React.FC<Props> = ({ isOpen, onClose, onLogout, wrapperRef, user }) => {
  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, wrapperRef, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-14 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden z-[9999]"
        >
          <div className="flex flex-col py-2">
            <NavItem
              to={user ? `/user/${user.username}` : "/login"}
              icon={<UserIcon size={18} />}
              label="Profile"
              onClick={onClose}
            />
            <NavItem to="/friends" icon={<Users size={18} />} label="Friends" onClick={onClose} />
            <NavItem to="/clubs" icon={<Sparkles size={18} />} label="Clubs" onClick={onClose} />
            <NavItem to="/lists" icon={<List size={18} />} label="My Lists" onClick={onClose} />
            <NavItem
              to={user ? `/user/${user.username}/settings` : "/login"}
              icon={<Settings size={18} />}
              label="Settings"
              onClick={onClose}
            />

            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-left text-red-400 hover:bg-red-500/20 transition"
            >
              <LogOut size={18} className="mr-3" /> Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;

const NavItem = ({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="flex items-center px-4 py-2 hover:bg-gray-700 transition"
  >
    {icon}
    <span className="ml-3">{label}</span>
  </NavLink>
);
