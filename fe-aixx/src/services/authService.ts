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
    const response = await loginRequest(email, password);
    // Store the token from the response
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
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
  } finally {
    localStorage.removeItem('auth_token');
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
