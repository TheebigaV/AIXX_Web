import {api} from "./api";
import {RoleFormData} from "@/types/role";

export const fetchRoles = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/roles?page=${page}&per_page=${perPage}`);

export const fetchAllRoles = () =>
    api.get(`/api/admin/roles/all`);

export const getRole = (id: string) =>
    api.get(`/api/admin/roles/${id}`);

export const createRole = (data: RoleFormData) =>
    api.post("/api/admin/roles", data);

export const updateRole = (id: string, data: RoleFormData) =>
    api.put(`/api/admin/roles/${id}`, data);

export const deleteRole = (id: string | null) =>
    api.delete(`/api/admin/roles/${id}`);
