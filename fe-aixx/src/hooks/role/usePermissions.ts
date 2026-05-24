
import { useEffect, useState } from "react";
import { fetchAllPermissions } from "@/lib/permissions";

export default function usePermissions() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const loadAllPermissions = async () => {
        setLoading(true);
        try {
            const res = await fetchAllPermissions();
            const data = res.data?.data || res.data || [];
            setPermissions(Array.isArray(data) ? data : []);
        } catch (err: any) {
            if (err.response) {
                // Backend responded with error
                setError(err.response.data.message || "Something went wrong while loading permissions.");
            } else {
                setError("Network error or server is not reachable.");
            }
        } finally {
            setLoading(false);
        }
    };


    return {
        permissions,
        loading,
        error,
        loadAllPermissions
    };
}
