import { api } from "./api";
import {BannerFormData} from "@/types/banner";

export const fetchBanners = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/banners?page=${page}&per_page=${perPage}`);

export const fetchAllBanners = () =>
    api.get(`/api/admin/banners/all`);

export const getBanner = (id: string) =>
    api.get(`/api/admin/banners/${id}`);

export const createBanner = (data: RoleFormData) =>
    api.post("/api/admin/banners", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const updateBanner = (id: string, data: RoleFormData) =>
    api.post(`/api/admin/banners/${id}`, data,{
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteBanner = (id: string | null) =>
    api.delete(`/api/admin/banners/${id}`);