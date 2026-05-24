import { useEffect, useState } from "react";
import { mediaBrowserApi } from "../../../../api/adminApi";
import { MediaEntity } from "../../../../api/types/adminAll.types";
import { Link } from "react-router-dom";

const CharacterMediaListPage = () => {
  const [items, setItems] = useState<MediaEntity[]>([]);

  useEffect(() => {
    mediaBrowserApi.getCharacters().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Character Media</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Name</th>
            <th>Media count</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-t">
              <td>{c.id}</td>
              <td>
                <Link
                  to={`${c.id}`}
                  className="text-blue-600 underline"
                >
                  {c.title}
                </Link>
              </td>
              <td>{c.mediaCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharacterMediaListPage;
