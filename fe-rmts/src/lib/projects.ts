import {api} from "./api";
import {ProjectFormData} from "../types/project";

export const fetchProjects = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/projects?page=${page}&per_page=${perPage}`);

export const fetchAllProjects = () => 
    api.get("/api/admin/projects/all");

export const getProject = (id: string) => 
    api.get(`/api/admin/projects/${id}`);

export const createProject = (data: ProjectFormData) =>
    api.post("/api/admin/projects", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const updateProject = (id: string, data: ProjectFormData) =>
    api.post(`/api/admin/projects/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteProject = (id: string | null) =>
    api.delete(`/api/admin/projects/${id}`);

export const deleteProjectImage = async (projectId: string, imageId: number) => {
    return api.delete(`/api/admin/projects/${projectId}/images/${imageId}`);
};

