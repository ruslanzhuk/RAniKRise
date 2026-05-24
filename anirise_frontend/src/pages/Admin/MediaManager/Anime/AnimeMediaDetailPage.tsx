import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntityMedia } from "../../../../api/adminApi";
import { MediaDto } from "../../../../api/types/adminAll.types";
import MediaUploadForm from "../components/MediaUploadForm";
import MediaTable from "../components/MediaTable";

const AnimeMediaDetailPage = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const [media, setMedia] = useState<MediaDto[]>([]);

  const load = () => {
    getEntityMedia("anime", Number(animeId)).then((res) =>
      setMedia(res.data)
    );
  };

  useEffect(load, [animeId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Anime #{animeId} media
      </h1>

      <MediaUploadForm
        entity="anime"
        entityId={Number(animeId)}
        onUploaded={load}
      />

      <MediaTable media={media} onRefresh={load} />
    </div>
  );
};

export default AnimeMediaDetailPage;
