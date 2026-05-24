import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminNews, deleteNews } from "../../../api/adminApi";
import ConfirmModal from "../../../components/ConfirmModal";

const NewsListPage = () => {
  const [news, setNews] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    getAdminNews().then(setNews).catch(console.error);
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteNews(deleteId);
    setNews(prev => prev.filter(n => n.id !== deleteId));
    setDeleteId(null);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">News Manager</h1>
        <button
          onClick={() => navigate("create")}
          className="bg-purple-600 px-4 py-2 rounded text-white"
        >
          Create News
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-400">
          <tr>
            <th>Title</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {news.map(n => (
            <tr key={n.id} className="border-b border-white/5">
              <td
                className="py-3 cursor-pointer hover:underline"
                onClick={() => navigate(`${n.id}`)}
              >
                {n.title}
              </td>
              <td>{new Date(n.createdAt).toLocaleString()}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => navigate(`${n.id}/edit`)}
                  className="text-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteId(n.id);
                    setModalOpen(true);
                  }}
                  className="text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Delete News"
        message="Are you sure you want to delete this news item? This action cannot be undone."
        onCancel={() => setModalOpen(false)}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default NewsListPage;
