import {api} from "./api";
import {ProductFormData} from "../types/product";

export const fetchProducts = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/products?page=${page}&per_page=${perPage}`);

export const fetchAllProducts = () =>
    api.get("/api/admin/products/all");

export const getProduct = (id: string) =>
    api.get(`/api/admin/products/${id}`);

export const createProduct = (data: ProductFormData) =>
    api.post("/api/admin/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const updateProduct = (id: string, data: ProductFormData) =>
    api.post(`/api/admin/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
});

export const deleteProduct = (id: string | null) =>
    api.delete(`/api/admin/products/${id}`);

export const deleteProductImage = async (productId: string, imageId: number) => {
    return api.delete(`/api/admin/products/${productId}/images/${imageId}`);
};