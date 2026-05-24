import { useEffect, useState } from "react";
import { mediaBrowserApi } from "../../../../api/adminApi";
import { MediaEntity } from "../../../../api/types/adminAll.types";
import { Link } from "react-router-dom";

const AnimeMediaListPage = () => {
  const [items, setItems] = useState<MediaEntity[]>([]);

  useEffect(() => {
    mediaBrowserApi.getAnime().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Anime Media</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Title</th>
            <th>Media count</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id} className="border-t">
              <td>{a.id}</td>
              <td>
                <Link
                  to={`${a.id}`}
                  className="text-blue-600 underline"
                >
                  {a.title}
                </Link>
              </td>
              <td>{a.mediaCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnimeMediaListPage;
