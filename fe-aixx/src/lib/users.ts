import {api} from "./api";
import {UserFormData} from "@/types/user";

export const fetchUsers = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/users?page=${page}&per_page=${perPage}`);

export const fetchAllUsers = () =>
    api.get(`/api/admin/users/all`);

export const getUser = (id: string) =>
    api.get(`/api/admin/users/${id}`);

export const createUser = (data: UserFormData) =>
    api.post("/api/admin/users", data);

export const updateUser = (id: string, data: UserFormData) =>
    api.put(`/api/admin/users/${id}`, data);

export const deleteUser = (id: string | null) =>
    api.delete(`/api/admin/users/${id}`);
