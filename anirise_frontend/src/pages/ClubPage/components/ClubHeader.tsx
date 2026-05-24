import React from "react";
import { ClubDetailDTO } from "../../../api/types/club.types";

interface Props {
  club: ClubDetailDTO;
  isMember: boolean;
  isAdmin: boolean;
  onJoinLeave: () => void;
}

const ClubHeader: React.FC<Props> = ({
  club,
  isMember,
  isAdmin,
  onJoinLeave,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold">{club.name}</h1>
        <p className="text-gray-600">{club.description}</p>

        <p className="text-sm mt-1">
          Admin:{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            {club.adminName}
          </span>
        </p>

        <p className="text-sm mt-1">
          Members: {club.membersCount}
        </p>
      </div>

      {!isAdmin && (
        <button
          onClick={onJoinLeave}
          className={`mt-4 md:mt-0 px-4 py-2 rounded text-white ${
            isMember ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isMember ? "Leave Club" : "Join Club"}
        </button>
      )}
    </div>
  );
};

export default ClubHeader;
