import { useState } from "react";
import collectionApi from "../../../api/collectionApi";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateCollectionModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    if (!name.trim()) return;

    await collectionApi.create({ name, description });
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          Create collection
        </h2>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Collection name"
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 text-white"
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full mb-4 px-3 py-2 rounded bg-zinc-800 text-white"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-400">
            Cancel
          </button>
          <button onClick={submit} className="bg-blue-600 px-4 py-2 rounded">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionModal;
