import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPublicProfileByUsername,
  getCurrentUser,
  PublicProfile,
  UserDto,
  UserStats,
} from "../../api/animeApi";
import { getUserAnimeStats } from "../../api/userAnimePublicApi";
import { getFriendshipStatus } from "../../api/friendApi";

import ProfileHeader from "./ProfileHeader";
import ProfileSocial from "./ProfileSocial";
import ProfilePosts from "./ProfilePosts";
import ProfileComments from "./ProfileComments";

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [canViewPosts, setCanViewPosts] = useState(false);
  const [canViewCollections, setCanViewCollections] = useState(false);

  const isOwner = currentUser?.id === profile?.id;

  useEffect(() => {
    if (!username) return;

    const load = async () => {
      try {
        const publicProfile = await getPublicProfileByUsername(username);
        setProfile(publicProfile);

        const publicStats = await getUserAnimeStats(username);
        setStats(publicStats);

        try {
          const me = await getCurrentUser();
          setCurrentUser(me);
        } catch {
          
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  useEffect(() => {
    if (!profile) return;

    if (profile.visibility === "Public" || isOwner) {
      setCanViewPosts(true);
      setCanViewCollections(true);
    } else {
      const checkFriend = async () => {
        try {
          const me = currentUser || (await getCurrentUser());
          setCurrentUser(me);

          const status = await getFriendshipStatus(profile.id);
          const canView = status === "friends";

          setCanViewPosts(canView);
          setCanViewCollections(canView);
        } catch {
          setCanViewPosts(false);
          setCanViewCollections(false);
        }
      };

      checkFriend();
    }
  }, [profile, currentUser, isOwner]);

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Loading profile…</div>;
  }

  if (!profile) {
    return <div className="text-center text-red-400 py-20">User not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <ProfileHeader user={profile} stats={stats} isOwner={isOwner} />

      <ProfileSocial userId={profile.id} username={profile.username} />

      {isOwner && (
        <div className="flex justify-end">
          <Link
            to={`/user/${profile.username}/posts/create`}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Create Post
          </Link>
        </div>
      )}

      {/* Collections */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Collections</h2>

          {canViewCollections && (
            <Link
              to={
                isOwner
                  ? "/collections/my"
                  : `/user/${profile.id}/collections`
              }
              className="text-purple-400 hover:underline text-sm"
            >
              View all →
            </Link>
          )}
        </div>

        {!canViewCollections && (
          <p className="text-gray-500">
            This user’s collections are private.
          </p>
        )}

        {canViewCollections && (
          <p className="text-gray-400 text-sm">
            View anime collections created by {profile.username}
          </p>
        )}
      </div>

      <ProfilePosts 
        userId={profile.id} 
        username={profile.username} 
        canViewPosts={canViewPosts} 
      />

      <ProfileComments userId={profile.id} />
    </div>
  );
}