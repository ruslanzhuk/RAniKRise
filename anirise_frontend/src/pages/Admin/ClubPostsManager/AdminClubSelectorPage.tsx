import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetMyClubs } from "../../../api/adminApi";
import { ClubSearchDTO } from "../../../api/types/adminAll.types";

const AdminClubSelectorPage = () => {
  const [clubs, setClubs] = useState<ClubSearchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminGetMyClubs();
        setClubs(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-gray-900">
          Club posts manager
        </h1>
        <p className="text-gray-700">
          Select a club to manage its posts
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : clubs.length === 0 ? (
        <p className="text-gray-600">You have no clubs.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="border rounded-lg p-4 bg-white hover:shadow cursor-pointer transition"
              onClick={() =>
                navigate(`/xkey/broadmin/posts/clubs/${club.id}`)
              }
            >
              <h3 className="text-lg font-semibold mb-1">
                {club.name}
              </h3>

              {club.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {club.description}
                </p>
              )}

              <div className="text-sm text-gray-500 flex justify-between">
                <span>Members: {club.membersCount}</span>
                <span>
                  {new Date(club.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminClubSelectorPage;
