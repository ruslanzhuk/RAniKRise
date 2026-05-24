export type ProfileHeaderUser = {
  id: string;
  username: string;
  avatarUrl?: string | null;
  createdAt?: string;
  joinedOn?: string;

  visibility: "Public" | "Private";
  
  birthDate?: string | null;
  gender?: string | null;
};