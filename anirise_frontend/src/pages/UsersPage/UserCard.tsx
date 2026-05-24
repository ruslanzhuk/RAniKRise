import React from "react";
import { UserProfileDTO } from "../../api/userSearchApi";
import { Link } from "react-router-dom";

type Props = {
  user: UserProfileDTO;
};

const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <Link
      to={`/user/${user.username}`}
      className={`
        flex items-center p-6 rounded-lg
        bg-card text-main
        shadow-md
        transition
        hover:shadow-lg
        hover:shadow-aqua/50
        hover:scale-105
        cursor-pointer
      `}
    >
      <img
        src={user.avatarUrl || "/default-avatar.png"}
        alt={user.username}
        className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-transparent transition"
      />
      <div>
        <div className="font-semibold">{user.username}</div>
        <div className="text-secondary text-sm">{user.role}</div>
      </div>
    </Link>
  );
};

export default UserCard;
