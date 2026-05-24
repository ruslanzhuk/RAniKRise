import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { postApi } from "../../api/postApi";
import { getPublicProfileByUsername, PublicProfile } from "../../api/animeApi";

export default function CreatePostPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const { quill, quillRef } = useQuill({ theme: "snow" });

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      try {
        const publicProfile = await getPublicProfileByUsername(username);
        setProfile(publicProfile);
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, [username]);

  if (!username || !profile) {
    return <div className="text-red-500">User not found</div>;
  }

  const MAX_VIDEO_SIZE_MB = 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    // Перевірка відео
    const oversized = filesArray.find(file => 
        file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024
    );

    if (oversized) {
        alert(`Video "${oversized.name}" is too large. Maximum size is ${MAX_VIDEO_SIZE_MB} MB.`);
        return;
    }

    setFiles(filesArray);
  };

  const handleSubmit = async () => {
    if (!quill) return;

    const content = quill.root.innerHTML;
    if (!content || content === "<p><br></p>") {
      alert("Post content cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Content", content);

      files.forEach((file) => formData.append("MediaFiles", file));

      await postApi.create(formData);

      alert("Post created successfully!");
      navigate(`/user/${username}/posts`);
    } catch (err) {
      console.error(err);
      alert("Failed to create post. Check CORS or JWT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Create a Post for {username}</h1>

      <div className="mb-4">
        <div ref={quillRef} style={{ minHeight: "200px" }} />
      </div>

      <div className="mb-4">
        <input
          type="file"
          multiple
          accept="image/*,video/*,.gif"
          onChange={handleFileChange}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        {loading ? "Publishing..." : "Publish Post"}
      </button>
    </div>
  );
}
