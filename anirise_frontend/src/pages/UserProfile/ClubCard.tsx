import { ClubDetailDTO } from "../../api/types/club.types";

export default function ClubCard({ club }: { club: ClubDetailDTO }) {
  return (
    <div
      className="bg-gray-800 rounded-xl p-5 shadow-md
                 hover:shadow-blue-500/30 hover:-translate-y-1
                 transition-all duration-300 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-white truncate">
        {club.name}
      </h3>

      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
        {club.description || "No description"}
      </p>

      <div className="mt-3 text-xs text-blue-400">
        Members: {club.membersCount ?? "—"}
      </div>
    </div>
  );
}
