import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import CommentTable from "./components/CommentTable";
import { adminCommentsApi } from "../../../api/adminApi";
import { AdminComment } from "../../../api/types/adminAll.types";

const ClubPostCommentsPage = () => {
  const [comments, setComments] = useState<AdminComment[]>([]);

  const load = async () => {
    const res = await adminCommentsApi.get({ targetType: "ClubPost" });
    setComments(res.data);
  };

  const deleteComment = async (id: number) => {
    await adminCommentsApi.delete(id);
    await load();
  };

  const blockUser = async (userId: string) => {
    await adminCommentsApi.blockUser(userId);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Club post comments</h1>
        <CommentTable comments={comments} onDelete={deleteComment} onBlock={blockUser} />
      </main>
    </div>
  );
};

export default ClubPostCommentsPage;
