import {api} from "./api";
import {ProjectFormData} from "@/types/project";

export const fetchProjects = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/projects?page=${page}&per_page=${perPage}`);

export const fetchAllProjects = () => 
    api.get("/api/projects/all");

export const getProject = (id: string) => 
    api.get(`/api/projects/${id}`);

export const getProjectBySlug = (slug: string) => 
    api.get(`/api/projects/${slug}/by-slug`);

export const fetchRandomProjects = (count: number = 3) =>
    api.get(`/api/projects/random/${count}`);
