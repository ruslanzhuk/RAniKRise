import http from "./http";

export interface HomeAnnouncementDto {
  title: string;
  contentHtml: string;
  imageUrl?: string;
}

export const getHomeAnnouncement = async (): Promise<HomeAnnouncementDto | null> => {
  const res = await http.get<HomeAnnouncementDto>("/home-announcement");
  return res.data ?? null;
};
