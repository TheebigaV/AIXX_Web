import { api } from "./api";

export const getCsrfToken = () => api.get("/sanctum/csrf-cookie");

export const loginRequest = (email: string, password: string) =>
    api.post("/api/login", { email, password });

export const logoutRequest = () => api.post("/api/logout");

export const fetchAuthenticatedUser = () => api.get("/api/profile");