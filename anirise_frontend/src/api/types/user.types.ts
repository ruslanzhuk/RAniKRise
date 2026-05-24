export type ThemePreference = "light" | "dark";

export type UserDto = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  createdAt: string;
  birthDate?: string | null;
  gender?: string | null;
  visibility: "Public" | "Private";
  themePreference: ThemePreference;
  isBlocked: boolean;
};


export type UserStats = {
  totalWatched: number;
  completed: number;
  dropped: number;
  favorites: number;
};

export type PublicProfile = {
  id: string;
  username: string;
  avatarUrl?: string | null;
  joinedOn: string;
  collections: number;
};

export type UpdateProfileRequest = {
  username: string;
  birthDate?: string | null;
  gender?: "Male" | "Female" | null;
  visibility: "Public" | "Private";
  themePreference?: "light" | "dark";
};

export type UpdateAvatarRequest = {
  AvatarUrl: string;
  CropX: number;
  CropY: number;
  CropWidth: number;
  CropHeight: number;
};
