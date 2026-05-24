import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminNewsById,
  createNews,
  updateNews,
  uploadNewsMedia,
} from "../../../api/adminApi";

const NewsFormPage: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (newsId) {
      getAdminNewsById(Number(newsId)).then((data) => {
        console.log("NEWS DATA:", data);
        setTitle(data.title);
        setPreviewContent(data.previewContent);
        setContentHtml(data.contentHtml);
      });
    }
  }, [newsId]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const { url } = await uploadNewsMedia(file);

      let tag = "";
      if (file.type.startsWith("image/") && file.type !== "image/gif") {
        tag = `<img src="${url}" alt="news-media" class="my-4 rounded shadow-md w-full" />`;
      } else if (file.type.startsWith("video/")) {
        tag = `<video src="${url}" controls class="my-4 rounded w-full"></video>`;
      } else if (file.type === "image/gif") {
        tag = `<img src="${url}" alt="news-media" class="my-4 rounded shadow-md w-full" />`;
      }

      setContentHtml((prev) => prev + tag);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title || !previewContent || !contentHtml) {
      alert("Please fill in all fields!");
      return;
    }

    const data = { title, previewContent, contentHtml };

    try {
      if (newsId) {
        await updateNews(Number(newsId), data);
      } else {
        await createNews(data);
      }

      navigate("/admin/news");
    } catch (err) {
      console.error(err);
      alert("Error saving news.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md text-black">
      <h1 className="text-2xl font-bold mb-4">
        {newsId ? "Edit News" : "Create News"}
      </h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Preview Content */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Preview Content</label>
        <textarea
          className="w-full border rounded p-2 min-h-[100px]"
          value={previewContent}
          onChange={(e) => setPreviewContent(e.target.value)}
        />
      </div>

      {/* Full Content */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Content (HTML)</label>
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)}
        />
      </div>

      {/* Media Upload */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Upload Media (image, video, GIF)</label>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          accept="image/*,video/*"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {newsId ? "Update News" : "Create News"}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>

      {/* Preview */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <div
          className="p-4 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
};

export default NewsFormPage;

