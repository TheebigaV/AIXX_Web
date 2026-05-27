import {api} from "./api";

export const fetchTrainings = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/trainings?page=${page}&per_page=${perPage}`);

export const fetchAllTrainings = () =>
    api.get("/api/admin/trainings/all");

export const getTraining = (id: string) =>
    api.get(`/api/admin/trainings/${id}`);

export const createTraining = (data: any) =>
    api.post("/api/admin/trainings", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const updateTraining = (id: string, data: any) =>
    api.post(`/api/admin/trainings/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteTraining = (id: string | null) =>
    api.delete(`/api/admin/trainings/${id}`);

// Public routes
export const fetchPublicTrainings = (type?: string) =>
    api.get(`/api/trainings/all${type ? `?type=${type}` : ""}`);
