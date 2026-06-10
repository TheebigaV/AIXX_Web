import { useEffect, useState } from "react";
import { fetchRoles, deleteRole, getRole as getRoleById, fetchAllRoles } from "@/lib/roles";

export default function useRoles() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from:0,
        to:0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRoles = async (page: number = 1, perPage: number = 10) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchRoles(page, perPage);
            setRoles(res.data.data);
            setPagination({
                current_page: res.data.meta.current_page,
                last_page: res.data.meta.last_page,
                per_page: res.data.meta.per_page,
                total: res.data.meta.total,
                from: res.data.meta.from,
                to: res.data.meta.to,
            });
        } catch (err: any) {
            console.error("Error loading roles:", err);
            if (err.response) {
                setError(err.response.data.message || "Something went wrong while loading roles.");
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
            await deleteRole(id);
            await loadRoles();
        } catch (err: any) {
            console.error("Error deleting role:", err);
            if (err.response) {
                setError(err.response.data.message || "Failed to delete role.");
                throw err;
            } else {
                setError("Network error.");
            }
        }
    };

    const getRole = async (id: string) => {
        setError(null);
        try {
            const res = await getRoleById(id);
            setSelectedRole(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error getting role:", err);
            setError(err?.response?.data?.message || "Failed to fetch role.");
            return null;
        }
    };

    const getAllRoles = async () => {
        setError(null);
        try {
            const res = await fetchAllRoles();
            // API returns array directly in data
            const rolesData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setRoles(rolesData);
            console.log('getAllRoles - Roles loaded:', rolesData);
            return rolesData;
        } catch (err: any) {
            console.error("getAllRoles - Error fetching roles:", err.response?.status, err.response?.data || err.message);
            // Return empty array on error instead of crashing
            setRoles([]);
            setError(err?.response?.data?.message || "Failed to fetch roles. Please try again.");
            return [];
        }
    };

    return {
        roles,
        selectedRole,
        loading,
        error,
        pagination,
        loadRoles,
        handleDelete,
        getRole,
        getAllRoles
    };
}
