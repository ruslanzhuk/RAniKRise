import { useEffect, useState } from "react";
import collectionApi from "../../api/collectionApi";
import { CollectionDTO } from "../../api/types/collection.types";
import CollectionCard from "./components/CollectionCard";
import CreateCollectionModal from "./components/CreateCollectionModal";

const MyCollectionsPage = () => {
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [favorites, setFavorites] = useState<CollectionDTO | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setCollections(await collectionApi.getMyCollections());
    setFavorites(await collectionApi.getFavorites());
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Collections</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          + Create
        </button>
      </div>

      {favorites && <CollectionCard collection={favorites} isFavorites />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map(c => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>

      {showCreate && (
        <CreateCollectionModal
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}
    </div>
  );
};

export default MyCollectionsPage;
