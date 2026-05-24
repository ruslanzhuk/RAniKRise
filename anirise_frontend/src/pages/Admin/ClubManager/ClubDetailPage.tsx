import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClubDetailDTO } from "../../../api/types/adminAll.types";
import { adminGetClubById, adminDeleteClub } from "../../../api/adminApi";

const AdminClubDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<ClubDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClub = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await adminGetClubById(Number(id));
      setClub(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClub();
  }, [id]);

  const handleDelete = async () => {
    if (!club) return;
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    await adminDeleteClub(club.id);
    navigate("/xkey/broadmin/clubs");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!club) return <p className="p-6 text-red-600">Club not found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{club.name}</h1>

      {club.imageUrl && (
        <img
          src={club.imageUrl}
          alt={club.name}
          className="mb-4 w-full max-w-md rounded shadow"
        />
      )}

      <p className="mb-2">
        <strong>Description:</strong> {club.description ?? "No description"}
      </p>

      <p className="mb-2">
        <strong>Created At:</strong> {new Date(club.createdAt).toLocaleString()}
      </p>

      <p className="mb-2">
        <strong>Admin:</strong> {club.adminName}
      </p>

      <p className="mb-2">
        <strong>Members Count:</strong> {club.membersCount}
      </p>

      <div className="mb-4">
        <strong>Members:</strong>
        {club.members.length === 0 ? (
          <p>No members</p>
        ) : (
          <ul className="list-disc list-inside">
            {club.members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
          onClick={() => navigate(`/xkey/broadmin/clubs/${club.id}/edit`)}
        >
          Edit Club
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete Club
        </button>
        <button
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate("/xkey/broadmin/clubs")}
        >
          Back to Clubs
        </button>
      </div>
    </div>
  );
};

export default AdminClubDetailPage;
