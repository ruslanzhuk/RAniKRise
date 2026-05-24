import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntityMedia } from "../../../../api/adminApi";
import { MediaDto } from "../../../../api/types/adminAll.types";
import MediaUploadForm from "../components/MediaUploadForm";
import MediaTable from "../components/MediaTable";

const StudioMediaDetailPage = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [media, setMedia] = useState<MediaDto[]>([]);

  const load = () => {
    getEntityMedia("studio", Number(studioId)).then((res) =>
      setMedia(res.data)
    );
  };

  useEffect(load, [studioId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Studio #{studioId} media
      </h1>

      <MediaUploadForm
        entity="studios"
        entityId={Number(studioId)}
        onUploaded={load}
      />

      <MediaTable media={media} onRefresh={load} />
    </div>
  );
};

export default StudioMediaDetailPage;
