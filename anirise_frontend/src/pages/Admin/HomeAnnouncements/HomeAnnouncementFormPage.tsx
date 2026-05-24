import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHomeAnnouncement,
  getHomeAnnouncementById,
  updateHomeAnnouncement,
} from "../../../api/adminApi";

const HomeAnnouncementFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;

    getHomeAnnouncementById(Number(id))
      .then(data => {
        setTitle(data.title);
        setContentHtml(data.contentHtml);
      })
      .catch(console.error);
  }, [id, isEdit]);

  const submit = async () => {
    if (isEdit) {
      await updateHomeAnnouncement(Number(id), {
        title,
        contentHtml,
        media: media ?? undefined,
      });
    } else {
      await createHomeAnnouncement({
        title,
        contentHtml,
        media: media ?? undefined,
      });
    }

    navigate("/xkey/broadmin/home-announcements");
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Home Announcement" : "Create Home Announcement"}
      </h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded h-48 font-mono"
        placeholder="HTML content"
        value={contentHtml}
        onChange={e => setContentHtml(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={e => setMedia(e.target.files?.[0] || null)}
      />

      <button
        onClick={submit}
        className="bg-yellow-500 px-4 py-2 rounded text-white"
      >
        Save
      </button>
    </div>
  );
};

export default HomeAnnouncementFormPage;
