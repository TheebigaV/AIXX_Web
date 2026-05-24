import {api} from "./api";


export const fetchInquiries = (page: number = 1, perPage: number = 10) =>
    api.get(`/api/admin/inquiries?page=${page}&per_page=${perPage}`);

export const fetchAllInquiries = () =>
    api.get("/api/admin/inquiries/all");

export const getInquiry = (id: string) =>
    api.get(`/api/admin/inquiries/${id}`);

export const deleteInquiry = (id: string | null) =>
    api.delete(`/api/admin/inquiries/${id}`);