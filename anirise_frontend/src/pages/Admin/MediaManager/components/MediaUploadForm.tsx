import { useState, ChangeEvent } from "react";
import { MediaType } from "../../../../api/types/adminAll.types";
import { uploadMedia } from "../../../../api/adminApi";
import MediaTypeSelect from "./MediaTypeSelect";

interface Props {
  entity: string;
  entityId: number;
  onUploaded: () => void;
}

const MediaUploadForm: React.FC<Props> = ({
  entity,
  entityId,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<MediaType>(MediaType.Anime_poster);
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (!file) return;

    setUploading(true);
    await uploadMedia(entity, entityId, type, file);
    setUploading(false);
    setFile(null);
    onUploaded();
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <MediaTypeSelect value={type} onChange={setType} />

      <button
        onClick={submit}
        disabled={uploading}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default MediaUploadForm;
