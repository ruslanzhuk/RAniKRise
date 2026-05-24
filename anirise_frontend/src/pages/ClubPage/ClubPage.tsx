import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { clubApi } from "../../api/clubApi";
import { ClubDetailDTO } from "../../api/types/club.types";
import ClubHeader from "./components/ClubHeader";
import PostList from "./components/PostList";
import ClubSidebar from "./components/ClubSidebar";
import { useAuth } from "../../context/AuthContext";

const ClubPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { user } = useAuth();

  const [club, setClub] = useState<ClubDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<"unauthorized" | null>(null);

  const fetchClub = useCallback(async () => {
    if (!clubId) return;

    setLoading(true);
    setAuthError(null);

    try {
      const data = await clubApi.getClubDetail(Number(clubId));
      setClub(data);

      console.group("🏱 Club debug");
      console.log("Club ID:", clubId);
      console.log("Current user:", user);
      console.log("Club detail:", data);
      console.log("Membership:", data.membership);
      console.groupEnd();
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAuthError("unauthorized");
      }
    } finally {
      setLoading(false);
    }
  }, [clubId, user]);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  const handleJoinLeave = async () => {
    if (!clubId || !club) return;

    if (club.membership.isMember) {
      await clubApi.leaveClub(Number(clubId));
    } else {
      await clubApi.joinClub(Number(clubId));
    }

    await fetchClub();
  };

  /* =========================
     RENDER STATES
     ========================= */

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authError === "unauthorized") {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Access restricted
        </h2>
        <p className="text-gray-600">
          Only registered users can view the content of this club.
        </p>
      </div>
    );
  }

  if (!club) {
    return <div>Club not found</div>;
  }

  /* =========================
     MAIN UI
     ========================= */

  return (
    <div className="w-full px-4 md:px-8 py-6">
      {/* HEADER */}
      <ClubHeader
        club={club}
        isMember={club.membership.isMember}
        isAdmin={club.membership.isAdmin}
        onJoinLeave={handleJoinLeave}
      />

      {/* CONTENT GRID */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT — MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-4">
          {club.membership.isMember ? (
            <PostList clubId={Number(clubId)} />
          ) : (
            <p className="text-gray-500">
              Join the club to see posts.
            </p>
          )}
        </div>

        {/* RIGHT — SIDEBAR */}
        <div className="lg:col-span-4 space-y-4">
          <ClubSidebar club={club} />
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
