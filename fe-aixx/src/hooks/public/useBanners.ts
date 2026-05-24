import { useEffect, useState } from "react";
import { fetchBanners, getBanner as getBannerById, fetchAllBanners } from "@/lib/public/banners";

export interface Banner {
    id: number;
    title_1: string | null;
    title_2: string | null;
    subtitle: string | null;
    image: {
        url: string;
    } | null;
}

export default function useBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [selectedBanner, setSelectedBanner] = useState<any>(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBanners = async (page: number = 1, perPage: number = 10) => {
        setLoading(true);
        try {
            const res = await fetchBanners(page, perPage);
            setBanners(res.data.data);
            setPagination({
                current_page: res.data.meta.current_page,
                last_page: res.data.meta.last_page,
                per_page: res.data.meta.per_page,
                total: res.data.meta.total,
                from: res.data.meta.from,
                to: res.data.meta.to,
            });
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Something went wrong while loading banners.");
            } else {
                setError("Network error or server is not reachable.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getBanner = async (id: string) => {
        setError(null);
        try {
            const res = await getBannerById(id);
            setSelectedBanner(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error getting banner:", err);
            setError(err?.response?.data?.message || "Failed to fetch banner.");
            return null;
        }
    };

    const getAllBanners = async (page?: string) => {
        setError(null);
        try {
            setLoading(true)
            const res = await fetchAllBanners(page);
            setBanners(res.data.data);
            setLoading(false)
            return res.data || [];
        } catch (err: any) {
            console.error("Error fetching all banners:", err);
            setError(err?.response?.data?.message || "Failed to fetch all banners.");
            setLoading(false);
            return [];
        }
    };

    return {
        banners,
        selectedBanner,
        loading,
        error,
        pagination,
        loadBanners,
        getBanner,
        getAllBanners,
    };
}
