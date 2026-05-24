import {
  getCsrfToken,
  loginRequest,
  logoutRequest,
  fetchAuthenticatedUser,
} from "@/lib/auth";
import {User} from "@/types/auth";

export const loginService = async (email: string, password: string): Promise<{ user: User }> => {
  try {
    await getCsrfToken();
    await loginRequest(email, password);
  } catch (error: any) {
    const msg = error?.response?.data?.message || "Login failed";
    throw new Error(msg);
  }
};

export const logoutService = async () => {
  try {
    await logoutRequest();
  } catch (error: any) {
    throw new Error("Logout failed");
  }
};

export const getProfileService = async () : Promise<{ user: User } | null> => {
  try {
    await getCsrfToken();
    const res = await fetchAuthenticatedUser();
    return res.data;
  } catch {
    return null;
  }
};
