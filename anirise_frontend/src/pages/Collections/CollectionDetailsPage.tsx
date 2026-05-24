import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import collectionApi from "../../api/collectionApi";
import { CollectionDTO } from "../../api/types/collection.types";
import CollectionAnimeGrid from "./components/CollectionAnimeGrid";

const CollectionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionDTO | null>(null);

  const load = async () => {
    const all = await collectionApi.getMyCollections();
    setCollection(all.find(c => c.id === Number(id)) ?? null);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!collection) return;

    const confirm = window.confirm(
      `Are you sure you want to delete the collection "${collection.name}"? This cannot be undone.`
    );
    if (!confirm) return;

    try {
      await collectionApi.deleteCollection(collection.id);
      navigate("/collections");
    } catch (err) {
      console.error("Failed to delete collection:", err);
      alert("Failed to delete collection. Please try again.");
    }
  };

  if (!collection) {
    return <p className="text-center text-gray-400">Collection not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{collection.name}</h1>
          <p className="text-gray-400">{collection.description}</p>
        </div>

        {/* Кнопка видалення */}
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Delete Collection
        </button>
      </div>

      <CollectionAnimeGrid
        animes={collection.animes}
        onRemove={async animeId => {
          await collectionApi.removeAnime(collection.id, animeId);
          load();
        }}
      />
    </div>
  );
};

export default CollectionDetailsPage;
