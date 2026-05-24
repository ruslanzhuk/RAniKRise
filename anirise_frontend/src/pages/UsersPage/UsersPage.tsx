import React, { useEffect, useState } from "react";
import { fetchUsers, UserProfileDTO } from "../../api/userSearchApi";
import UserCard from "./UserCard";
import UserSearchInput from "./UserSearchInput";
import Pagination from "./Pagination";

const PAGE_SIZE = 20;

const UsersPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserProfileDTO[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers({ query, page, pageSize: PAGE_SIZE });
      setUsers(data);
      setHasNext(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [query, page]);

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-main">Users</h1>

      <UserSearchInput
        query={query}
        onChange={(value) => { setPage(1); setQuery(value); }}
      />

      {loading ? (
        <div className="mt-8 text-center text-secondary">Loading...</div>
      ) : users.length === 0 ? (
        <div className="mt-8 text-center text-secondary">No users found.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      <Pagination page={page} onPageChange={setPage} hasNext={hasNext} />
    </div>
  );
};

export default UsersPage;
