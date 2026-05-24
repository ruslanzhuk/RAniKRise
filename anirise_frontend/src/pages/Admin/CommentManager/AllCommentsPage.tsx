import { useEffect, useState } from "react";
import CommentTable from "./components/CommentTable";
import { adminCommentsApi } from "../../../api/adminApi";
import { AdminComment } from "../../../api/types/adminAll.types";

const AllCommentsPage = () => {
  const [comments, setComments] = useState<AdminComment[]>([]);

  const load = async () => {
    const res = await adminCommentsApi.get({});
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
        <h1 className="text-2xl font-bold mb-6">All comments</h1>

        <CommentTable
          comments={comments}
          onDelete={deleteComment}
          onBlock={blockUser}
          linkMode="absolute"
        />
      </main>
    </div>
  );
};

export default AllCommentsPage;
