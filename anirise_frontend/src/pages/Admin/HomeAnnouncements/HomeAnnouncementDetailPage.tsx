import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHomeAnnouncementById } from "../../../api/adminApi";
import { HomeAnnouncementDto } from "../../../api/types/adminAll.types";
import HtmlContent from "../../../components/HtmlContent";

const HomeAnnouncementDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] =
    useState<HomeAnnouncementDto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getHomeAnnouncementById(Number(id))
      .then(setAnnouncement)
      .catch(console.error);
  }, [id]);

  if (!announcement) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{announcement.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Created at: {new Date(announcement.createdAt).toLocaleString()}
      </p>

      {announcement.imageUrl && (
        <img
          src={announcement.imageUrl}
          alt={announcement.title}
          className="mb-4 rounded shadow"
        />
      )}

      <HtmlContent
        html={announcement.contentHtml}
        className="prose max-w-full"
      />

      <button
        onClick={() =>
          navigate(`/xkey/broadmin/home-announcements/${announcement.id}/edit`)
        }
        className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
      >
        Edit
      </button>
    </div>
  );
};

export default HomeAnnouncementDetailPage;
