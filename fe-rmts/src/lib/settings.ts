import api from "./api";

export const fetchSettings = () => {
  return api.get("/api/admin/settings");
};

export const updateSettings = (data: FormData) => {
  return api.post("/api/admin/settings", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchPublicSettings = () => {
  return api.get("/api/settings");
};
