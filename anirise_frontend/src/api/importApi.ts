import httpAnime from "./importHttp";

export interface ImportAnimeResult {
  id: number;
  title: string;
  japaneseTitle?: string;
}

export const importAnimeById = async (
  id: number
): Promise<ImportAnimeResult> => {
  const response = await httpAnime.post<ImportAnimeResult>(`/import/${id}`);
  return response.data;
};
