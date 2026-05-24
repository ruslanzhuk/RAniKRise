import animeApi from "./animeApi";

export type NewsPreviewDTO = {
  id: number;
  title: string;
  previewContent: string;
  createdAt: string;
  likes: number;
  dislikes: number;
};

export type NewsDetailsDTO = {
  id: number;
  title: string;
  contentHtml: string;
  createdAt: string;
  updatedAt?: string | null;
  authorName: string;
  likes: number;
  dislikes: number;
  userReaction?: ReactionType | null;
};


export type NewsCreateDTO = {
  title: string;
  previewContent: string; 
  contentHtml: string;    
};


export type NewsUpdateDTO = {
  title?: string;
  previewContent?: string;
  contentHtml?: string;
};

export enum ReactionType {
  Like = "Like",
  Dislike = "Dislike"
}

export type NewsRequestParams = {
  limit?: number;
  page?: number;
  offset?: number;
  sortBy?: "CreatedAt" | "Title" | "Author";
  sortOrder?: "asc" | "desc";
};

// ===== NEWS ROUTES =====

// GET /news
export const getAllNews = async (): Promise<NewsPreviewDTO[]> => {
  try {
    const res = await animeApi.get<NewsPreviewDTO[]>("/news");
    return res.data;
  } catch (error) {
    console.error("Error fetching news", error);
    return [];
  }
};

export const getLatestNews = async (
  params: NewsRequestParams = { limit: 4, sortBy: "CreatedAt", sortOrder: "desc" }
): Promise<NewsPreviewDTO[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const res = await animeApi.get<NewsPreviewDTO[]>(
      `/news/query?${queryParams.toString()}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching latest news", error);
    return [];
  }
};


// GET /news/:id
export const getNewsById = async (id: number): Promise<NewsDetailsDTO | null> => {
  try {
    const res = await animeApi.get<NewsDetailsDTO>(`/news/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching news ${id}`, error);
    return null;
  }
};

// POST /news
export const createNews = async (data: NewsCreateDTO): Promise<number | null> => {
  try {
    const res = await animeApi.post<{ id: number }>("/news", data);
    return res.data.id;
  } catch (error) {
    console.error("Error creating news", error);
    return null;
  }
};

// PUT /news/:id
export const updateNews = async (
  id: number,
  data: NewsUpdateDTO
): Promise<boolean> => {
  try {
    await animeApi.put(`/news/${id}`, data);
    return true;
  } catch (error) {
    console.error(`Error updating news ${id}`, error);
    return false;
  }
};

// DELETE /news/:id
export const deleteNews = async (id: number): Promise<boolean> => {
  try {
    await animeApi.delete(`/news/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting news ${id}`, error);
    return false;
  }
};

// POST /news/:id/reaction
export const addReactionToNews = async (id: number, type: ReactionType): Promise<boolean> => {
  try {
    await animeApi.post(`/news/${id}/reaction`, null, { params: { type } });
    return true;
  } catch (error) {
    console.error(`Error adding reaction to news ${id}`, error);
    return false;
  }
};

// DELETE /news/:id/reaction
export const removeReactionFromNews = async (id: number): Promise<boolean> => {
  try {
    await animeApi.delete(`/news/${id}/reaction`);
    return true;
  } catch (error) {
    console.error(`Error removing reaction from news ${id}`, error);
    return false;
  }
};
