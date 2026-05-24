import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";

const avatarCache = new Map<string, string | null>();

export const useUserAvatar = (userId: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (avatarCache.has(userId)) {
      setAvatarUrl(avatarCache.get(userId)!);
      return;
    }

    userApi
      .getPublicProfile(userId)
      .then(profile => {
        const avatar = profile.avatarUrl ?? null;
        avatarCache.set(userId, avatar);
        setAvatarUrl(avatar);
      })
      .catch(() => {
        avatarCache.set(userId, null);
        setAvatarUrl(null);
      });
  }, [userId]);

  return avatarUrl;
};
