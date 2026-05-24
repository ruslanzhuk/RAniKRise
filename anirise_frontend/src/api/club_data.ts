import animeApi from "./animeApi";

// Types
export type ClubSearchDTO = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  membersCount: number;
  createdAt: string;
};

export type ClubDetailDTO = {
  id: number;
  name: string;
  description?: string | null;
  imageUrls: string[];
  members: {
    id: string;
    username: string;
    avatarUrl?: string | null;
    joinedAt: string;
  }[];
  posts: {
    id: number;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
  }[];
  createdAt: string;
};

export type ClubCreateDTO = {
  name: string;
  description?: string;
};

export type ClubUpdateDTO = {
  name?: string;
  description?: string;
};

export type ClubRequestParams = {
  limit?: number;
  page?: number;
  offset?: number;
  sortBy?: "CreatedAt" | "Name" | "MembersCount";
  sortOrder?: "asc" | "desc";
  name?: string;
};

// ===== CLUB ROUTES =====

// GET /clubs
export const getAllClubs = async (): Promise<ClubSearchDTO[]> => {
  try {
    const res = await animeApi.get<ClubSearchDTO[]>("/clubs");
    return res.data;
  } catch (error) {
    console.error("Error fetching clubs", error);
    return [];
  }
};

export const getClubs = async (params: ClubRequestParams = {}): Promise<ClubSearchDTO[]> => {
  try {
    const query = new URLSearchParams();

    if (params.limit !== undefined) query.append("limit", params.limit.toString());
    if (params.page !== undefined) query.append("page", params.page.toString());
    if (params.offset !== undefined) query.append("offset", params.offset.toString());
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);

    const res = await animeApi.get<ClubSearchDTO[]>(`/clubs/query?${query.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching clubs with params", error);
    return [];
  }
};

export const getClubsFiltered = async (params: ClubRequestParams): Promise<ClubSearchDTO[]> => {
  try {
    const query = new URLSearchParams();

    if (params.limit) query.append("limit", params.limit.toString());
    if (params.page) query.append("page", params.page.toString());
    if (params.offset) query.append("offset", params.offset.toString());
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);
    if (params.name) query.append("name", params.name);

    const res = await animeApi.get<ClubSearchDTO[]>(`/clubs/query?${query.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching clubs with filter", error);
    return [];
  }
};

// GET /clubs/:id
export const getClubById = async (id: number): Promise<ClubDetailDTO> => {
  const res = await animeApi.get<ClubDetailDTO>(`/clubs/${id}`);
  return res.data;
};


// POST /clubs
export const createClub = async (data: ClubCreateDTO): Promise<number | null> => {
  try {
    const res = await animeApi.post<{ id: number }>("/clubs", data);
    return res.data.id;
  } catch (error) {
    console.error("Error creating club", error);
    return null;
  }
};

// PUT /clubs/:id
export const updateClub = async (id: number, data: ClubUpdateDTO): Promise<boolean> => {
  try {
    await animeApi.put(`/clubs/${id}`, data);
    return true;
  } catch (error) {
    console.error(`Error updating club ${id}`, error);
    return false;
  }
};

// DELETE /clubs/:id
export const deleteClub = async (id: number): Promise<boolean> => {
  try {
    await animeApi.delete(`/clubs/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting club ${id}`, error);
    return false;
  }
};

// POST /clubs/:id/add-member
export const addMemberToClub = async (id: number, userId: string): Promise<boolean> => {
  try {
    await animeApi.post(`/clubs/${id}/add-member`, { userId });
    return true;
  } catch (error) {
    console.error(`Error adding member to club ${id}`, error);
    return false;
  }
};
