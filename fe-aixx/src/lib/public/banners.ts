import { api } from "./api";
import {BannerFormData} from "@/types/banner";

export const fetchBanners = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/banners?page=${page}&per_page=${perPage}`);

export const fetchAllBanners = (page?: string) =>
    api.get(`/api/banners/all${page ? `?page=${page}` : ''}`);

export const getBanner = (id: string) =>
    api.get(`/api/banners/${id}`);


