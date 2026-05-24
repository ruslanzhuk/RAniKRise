import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetClubPostById,
  adminCreateClubPost,
  adminUpdateClubPost,
  adminUploadClubPostMedia,
} from "../../../api/adminApi";

interface ClubPostFormPageProps {}

const ClubPostFormPage = () => {
  const { clubId, postId } = useParams<{ clubId: string; postId: string }>();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (postId) {
      adminGetClubPostById(Number(postId)).then((data) => {
        setContent(data.content);
      });
    }
  }, [postId]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const { url } = await adminUploadClubPostMedia(file);

      let tag = "";
      if (file.type.startsWith("image/")) {
        tag = `<img src="${url}" alt="media" />`;
      } else if (file.type.startsWith("video/")) {
        tag = `<video src="${url}" controls></video>`;
      }

      setContent((prev) => prev + tag);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!clubId) return;

    const formData = new FormData();
    formData.append("content", content);

    if (postId) {
      await adminUpdateClubPost(Number(postId), formData);
    } else {
      await adminCreateClubPost(Number(clubId), formData);
    }

    navigate(`/admin/clubs/${clubId}/posts`);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {postId ? "Edit Club Post" : "Create Club Post"}
      </h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Content (HTML)</label>
        <textarea
          className="w-full border rounded p-2 min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Upload Media</label>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          {postId ? "Update Post" : "Create Post"}
        </button>

        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <div
          className="p-2 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default ClubPostFormPage;
