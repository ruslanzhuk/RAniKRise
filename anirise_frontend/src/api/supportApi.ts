import http from "./http";

export interface SupportMessageRequest {
  email: string;
  message: string;
}

export const sendSupportMessage = async (
  data: SupportMessageRequest
): Promise<void> => {
  await http.post("/support", data);
};
