import { useEffect, useState } from "react";
import { fetchBanners, deleteBanner, getBanner as getBannerById, fetchAllBanners } from "@/lib/banners";

export default function useBanners() {
    const [banners, setBanners] = useState([]);
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

    const handleDelete = async (id: string | null) => {
        setError(null);
        try {
            await deleteBanner(id);
            await loadBanners();
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Failed to delete banner.");
                throw err;
            } else {
                setError("Network error.");
            }
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

    const getAllBanners = async () => {
        setError(null);
        try {
            const res = await fetchAllBanners();
            return res.data || [];
        } catch (err: any) {
            console.error("Error fetching all banners:", err);
            setError(err?.response?.data?.message || "Failed to fetch all banners.");
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
        handleDelete,
        getBanner,
        getAllBanners,
    };
}
