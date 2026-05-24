import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClubSearchDTO } from "../../../api/types/adminAll.types";
import { adminGetMyClubs, adminDeleteClub } from "../../../api/adminApi";

const AdminClubManagerPage = () => {
  const [clubs, setClubs] = useState<ClubSearchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const data = await adminGetMyClubs();
      setClubs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    await adminDeleteClub(id);
    fetchClubs();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">My Clubs</h1>

      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => navigate("/xkey/broadmin/clubs/create")}
      >
        Create New Club
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : clubs.length === 0 ? (
        <p>No clubs found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Members</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id}>
                <td className="border p-2">{club.id}</td>
                <td className="border p-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/xkey/broadmin/clubs/${club.id}`)}
                  >
                    {club.name}
                  </button>
                </td>
                <td className="border p-2">{club.membersCount}</td>
                <td className="border p-2">{new Date(club.createdAt).toLocaleDateString()}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                    onClick={() => navigate(`/xkey/broadmin/clubs/${club.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                    onClick={() => handleDelete(club.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminClubManagerPage;
