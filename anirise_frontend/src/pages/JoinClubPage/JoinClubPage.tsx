import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getClubsFiltered, ClubSearchDTO, ClubRequestParams } from "../../api/club_data";

const JoinClubPage: React.FC = () => {
  const [clubs, setClubs] = useState<ClubSearchDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const limit = 12;

  const fetchClubs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const params: ClubRequestParams = {
      page: page,
      limit: limit,
      sortBy: "MembersCount",
      sortOrder: "desc",
      name: filter || undefined,
    };

    const data = await getClubsFiltered(params);

    setClubs((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const newUnique = data.filter((c) => !existingIds.has(c.id));
      return [...prev, ...newUnique];
    });

    setHasMore(data.length === limit);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchClubs();
      }
    };
    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [clubs, filter]);

  // Reset when filter changes
  useEffect(() => {
    setClubs([]);
    setPage(1);
    setHasMore(true);
  }, [filter]);

  useEffect(() => {
    fetchClubs();
  }, [page, filter]);

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto p-4 h-[80vh] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Join a Club</h1>

      <input
        type="text"
        placeholder="Search clubs..."
        className="mb-4 p-2 w-full rounded bg-gray-800 text-white"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clubs.map((club) => (
          <Link
            key={club.id}
            to={`/clubs/${club.id}`}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition block"
          >
            <h3 className="font-bold text-lg">{club.name}</h3>
            <p className="text-gray-300 text-sm mt-1">{club.description}</p>
            <p className="text-gray-400 text-sm mt-1">{club.membersCount} members</p>
          </Link>
        ))}
      </div>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && !loading && <p className="text-center mt-4 text-gray-400">No more clubs</p>}
    </div>
  );
};

export default JoinClubPage;
