import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEntityMedia } from "../../../../api/adminApi";
import { MediaDto } from "../../../../api/types/adminAll.types";
import MediaUploadForm from "../components/MediaUploadForm";
import MediaTable from "../components/MediaTable";

const AuthorMediaDetailPage = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [media, setMedia] = useState<MediaDto[]>([]);

  const load = () => {
    getEntityMedia("author", Number(authorId)).then((res) =>
      setMedia(res.data)
    );
  };

  useEffect(load, [authorId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Author #{authorId} media
      </h1>

      <MediaUploadForm
        entity="author"
        entityId={Number(authorId)}
        onUploaded={load}
      />

      <MediaTable media={media} onRefresh={load} />
    </div>
  );
};

export default AuthorMediaDetailPage;
