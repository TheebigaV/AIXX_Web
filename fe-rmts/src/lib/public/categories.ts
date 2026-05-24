import {api} from "./api";
// import {CategoryFormData} from "@/hooks/category/useCategoryForm";

export const fetchCategories = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/categories?page=${page}&per_page=${perPage}`);

export const fetchAllCategories = () =>
    api.get("/api/categories/all");

export const getCategory = (id: string) =>
    api.get(`/api/categories/${id}`);
