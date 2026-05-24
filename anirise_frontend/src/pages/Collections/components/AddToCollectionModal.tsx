import { useEffect, useState } from "react";
import { CollectionDTO } from "../../../api/types/collection.types";
import collectionApi from "../../../api/collectionApi";
import { isAnimeInCollection } from "../../../utils/collection.utils";

interface Props {
  animeId: number;
  collections: CollectionDTO[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

const AddToCollectionModal: React.FC<Props> = ({
  animeId,
  collections,
  onClose,
  onSaved,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedIds(
      collections
        .filter(c => isAnimeInCollection(c, animeId))
        .map(c => c.id)
    );
  }, [animeId, collections]);

  const toggle = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    await collectionApi.syncAnime({
      animeId,
      collectionIds: selectedIds,
    });

    await onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-white mb-4">
          Add to collections
        </h2>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {collections.map(c => {
            const checked = selectedIds.includes(c.id);

            return (
              <label
                key={c.id}
                className="flex items-center gap-3
                           px-3 py-2 rounded
                           bg-zinc-800 hover:bg-zinc-700
                           cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(c.id)}
                />
                <span className="text-white">{c.name}</span>
              </label>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;
