import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntityMedia } from "../../../../api/adminApi";
import { MediaDto } from "../../../../api/types/adminAll.types";
import MediaUploadForm from "../components/MediaUploadForm";
import MediaTable from "../components/MediaTable";

const CharacterMediaDetailPage = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const [media, setMedia] = useState<MediaDto[]>([]);

  const load = () => {
    getEntityMedia("character", Number(characterId)).then((res) =>
      setMedia(res.data)
    );
  };

  useEffect(load, [characterId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Character #{characterId} media
      </h1>

      <MediaUploadForm
        entity="characters"
        entityId={Number(characterId)}
        onUploaded={load}
      />

      <MediaTable media={media} onRefresh={load} />
    </div>
  );
};

export default CharacterMediaDetailPage;
