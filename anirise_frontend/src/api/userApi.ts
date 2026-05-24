import http from "./http";
import { UserDto, UpdateProfileRequest, UpdateAvatarRequest } from "./types/user.types";

export const getCurrentUser = async (): Promise<UserDto> => {
  const res = await http.get<UserDto>("/user/me");
  return res.data;
};

export const userApi = {
  async getPublicProfile(userId: string): Promise<UserDto> {
    const res = await http.get<UserDto>(
      `/user/public/${userId}`
    );
    return res.data;
  },
};

export const updateTheme = async (theme: "light" | "dark") => {
  await http.put("/user/theme", { themePreference: theme });
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UserDto> => {
  const response = await http.put<UserDto>("/user/profile", data);
  return response.data;
};

export const updateAvatar = async (data: UpdateAvatarRequest) => {
  const res = await http.put("/user/avatar", data);
  return res.data;
};

export const requestEmailChange = async (newEmail: string) => {
  const res = await http.post("/user/email/change", { newEmail });
  return res.data;
};

export const confirmEmailChange = async (token: string) => {
  const res = await http.post("/user/email/confirm", { token });
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const res = await http.post("/user/password/reset/request", { email });
  return res.data;
};

export const confirmPasswordReset = async (token: string, newPassword: string) => {
  const res = await http.post("/user/password/reset/confirm", { token, newPassword });
  return res.data;
};

export const getEmailChangeStatus = async () => {
  const res = await http.get("/user/email/status");
  return res.data as {
    inProgress: boolean;
    step: "none" | "confirm-old" | "confirm-new";
    pendingEmail?: string;
  };
};

export const cancelEmailChange = async () => {
  const res = await http.post("/user/email/cancel");
  return res.data;
};

export const deleteAccount = async (password: string) => {
  const res = await http.post("/user/delete", { password });
  return res.data;
};