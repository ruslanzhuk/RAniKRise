import React from "react";
import { ClubDetailDTO } from "../../../api/types/club.types";

interface Props {
  club: ClubDetailDTO;
}

const ClubSidebar: React.FC<Props> = ({ club }) => {
  return (
    <div className="space-y-4">
      {/* PINNED LINKS */}
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Pinned</h3>
        <ul className="space-y-2 text-sm text-blue-500">
          <li className="hover:underline cursor-pointer">📌 Rules</li>
          <li className="hover:underline cursor-pointer">📌 Announcements</li>
          <li className="hover:underline cursor-pointer">📌 FAQ</li>
        </ul>
      </div>

      {/* MEMBERS */}
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">
          Members ({club.membersCount})
        </h3>
        <ul className="space-y-1 text-sm text-gray-700 max-h-64 overflow-auto">
          {club.members.slice(0, 10).map(m => (
            <li key={m} className="hover:underline cursor-pointer">
              {m}
            </li>
          ))}
          {club.members.length > 10 && (
            <li className="text-xs text-gray-400">
              +{club.members.length - 10} more
            </li>
          )}
        </ul>
      </div>

      {/* EXTRA INFO */}
      <div className="rounded-lg border p-4 text-sm text-gray-600">
        <p>Created: {new Date(club.createdAt).toLocaleDateString()}</p>
        <p>Admin: {club.adminName}</p>
      </div>
    </div>
  );
};

export default ClubSidebar;
