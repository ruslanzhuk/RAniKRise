import { useEffect, useState } from "react";
import { mediaBrowserApi } from "../../../../api/adminApi";
import { MediaEntity } from "../../../../api/types/adminAll.types";
import { Link } from "react-router-dom";

const StudioMediaListPage = () => {
  const [items, setItems] = useState<MediaEntity[]>([]);

  useEffect(() => {
    mediaBrowserApi.getStudios().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Studio Media</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Name</th>
            <th>Media count</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id} className="border-t">
              <td>{s.id}</td>
              <td>
                <Link
                  to={`${s.id}`}
                  className="text-blue-600 underline"
                >
                  {s.title}
                </Link>
              </td>
              <td>{s.mediaCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudioMediaListPage;
