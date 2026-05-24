import { useEffect, useState } from "react";
import {
    fetchInquiries,
    deleteInquiry,
    getInquiry as getInquiryById,
    fetchAllInquiries,
} from "@/lib/inquiries"; // <-- your API functions

export default function useInquiries() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
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

    // Load paginated inquiries
    const loadInquiries = async (page: number = 1, perPage: number = 10) => {
        setLoading(true);
        try {
            const res = await fetchInquiries(page, perPage);
            setInquiries(res.data.data);
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
                setError(err.response.data.message || "Something went wrong while loading inquiries.");
            } else {
                setError("Network error or server is not reachable.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete an inquiry
    const handleDelete = async (id: string | null) => {
        setError(null);
        try {
            await deleteInquiry(id);
            await loadInquiries();
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Failed to delete inquiry.");
                throw err;
            } else {
                setError("Network error.");
            }
        }
    };

    // Get a single inquiry
    const getInquiry = async (id: string) => {
        setError(null);
        try {
            const res = await getInquiryById(id);
            setSelectedInquiry(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error getting inquiry:", err);
            setError(err?.response?.data?.message || "Failed to fetch inquiry.");
            return null;
        }
    };

    // Get all inquiries without pagination
    const getAllInquiries = async () => {
        setError(null);
        try {
            const res = await fetchAllInquiries();
            return res.data || [];
        } catch (err: any) {
            console.error("Error fetching all inquiries:", err);
            setError(err?.response?.data?.message || "Failed to fetch all inquiries.");
            return [];
        }
    };

    return {
        inquiries,
        selectedInquiry,
        loading,
        error,
        pagination,
        loadInquiries,
        handleDelete,
        getInquiry,
        getAllInquiries,
    };
}
