import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { adminCommentsApi } from "../../../api/adminApi";
import { AdminComment } from "../../../api/types/adminAll.types";

const CommentDetailPage = () => {
  const { commentId } = useParams<{ commentId: string }>();
  const [comment, setComment] = useState<AdminComment | null>(null);

  useEffect(() => {
    if (!commentId) return;
    adminCommentsApi.getById(Number(commentId))
        .then((res) => setComment(res.data));
  }, [commentId]);

  if (!comment) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Comment Detail</h1>
        <div className="bg-white p-4 rounded shadow">
          <p><strong>User:</strong> {comment.username} ({comment.email})</p>
          <p><strong>Comment:</strong> {comment.content}</p>
          <p><strong>Target:</strong> {comment.targetType} - {comment.targetTitle}</p>
          <p><strong>Created:</strong> {new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
};

export default CommentDetailPage;
