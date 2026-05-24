import {api} from "./api";
import {CategoryFormData} from "@/hooks/category/useCategoryForm";

export const fetchCategories = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/categories?page=${page}&per_page=${perPage}`);

export const fetchAllCategories = () =>
    api.get("/api/admin/categories/all");

export const getCategory = (id: string) =>
    api.get(`/api/admin/categories/${id}`);

export const createCategory = (data: CategoryFormData) =>
    api.post("/api/admin/categories", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const updateCategory = (id: string, data: CategoryFormData) =>
    api.post(`/api/admin/categories/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteCategory = (id: string | null) =>
    api.delete(`/api/admin/categories/${id}`);