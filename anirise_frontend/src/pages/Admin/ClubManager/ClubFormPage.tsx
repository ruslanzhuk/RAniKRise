import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClubCreateDTO,
  ClubUpdateDTO,
  ClubDetailDTO,
} from "../../../api/types/adminAll.types";
import { adminGetClubById, adminCreateClub, adminUpdateClub } from "../../../api/adminApi";

const ClubFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<ClubCreateDTO>({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;

    setLoading(true);
    adminGetClubById(Number(id))
      .then((club: ClubDetailDTO) => {
        setForm({
          name: club.name,
          description: club.description ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        const payload: ClubUpdateDTO = { ...form };
        await adminUpdateClub(Number(id), payload);
        navigate(`/xkey/broadmin/clubs/${id}`);
      } else {
        const payload: ClubCreateDTO = { ...form };
        const newId = await adminCreateClub(payload);
        navigate(`/xkey/broadmin/clubs/${newId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? "Edit Club" : "Create New Club"}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {isEdit ? "Save Changes" : "Create Club"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => navigate("/xkey/broadmin/clubs")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClubFormPage;
