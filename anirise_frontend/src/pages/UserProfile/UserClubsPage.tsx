import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { clubApi } from "../../api/clubApi";
import { ClubDetailDTO } from "../../api/types/club.types";
import ClubCard from "./ClubCard";

export default function UserClubsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [clubs, setClubs] = useState<ClubDetailDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    clubApi.getUserClubs(userId)
      .then(setClubs)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-400 py-20">Loading clubs…</p>;
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        🏝️ User is not in any clubs yet
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        🏛️ Clubs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {clubs.map(club => (
          <Link key={club.id} to={`/clubs/${club.id}`}>
            <ClubCard club={club} />
          </Link>
        ))}
      </div>
    </div>
  );
}
