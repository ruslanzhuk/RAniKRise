import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import collectionApi from "../../api/collectionApi";
import { CollectionDTO } from "../../api/types/collection.types";
import CollectionCard from "./components/CollectionCard";

const UserCollectionsPage = () => {
  const { userId } = useParams();
  const [collections, setCollections] = useState<CollectionDTO[]>([]);

  useEffect(() => {
    if (userId) {
      collectionApi.getUserCollections(userId).then(setCollections);
    }
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">
        User collections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map(c => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </div>
  );
};

export default UserCollectionsPage;
