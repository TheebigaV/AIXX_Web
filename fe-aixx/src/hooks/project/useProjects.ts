import { useState } from "react";
import {
    fetchProjects,
    deleteProject,
    getProject as getProjectById,
    fetchAllProjects,
} from "@/lib/projects"; // Make sure these API functions exist

export default function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
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

    // Load paginated projects
    const loadProjects = async (page: number = 1, perPage: number = 10) => {
        setLoading(true);
        try {
            const res = await fetchProjects(page, perPage);
            setProjects(res.data.data);
            setPagination({
                current_page: res.data.meta.current_page,
                last_page: res.data.meta.last_page,
                per_page: res.data.meta.per_page,
                total: res.data.meta.total,
                from: res.data.meta.from,
                to: res.data.meta.to,
            });
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Something went wrong while loading projects."
            );
        } finally {
            setLoading(false);
        }
    };

    // Delete a project
    const handleDelete = async (id: string | null) => {
        setError(null);
        try {
            await deleteProject(id);
            await loadProjects();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete project.");
            throw err;
        }
    };

    // Get single project
    const getProject = async (id: string) => {
        setError(null);
        try {
            const res = await getProjectById(id);
            setSelectedProject(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error getting project:", err);
            setError(err?.response?.data?.message || "Failed to fetch project.");
            return null;
        }
    };

    // Fetch all projects (no pagination)
    const getAllProjects = async () => {
        setError(null);
        try {
            const res = await fetchAllProjects();
            return res.data || [];
        } catch (err: any) {
            console.error("Error fetching all projects:", err);
            setError(err?.response?.data?.message || "Failed to fetch all projects.");
            return [];
        }
    };

    return {
        projects,
        selectedProject,
        loading,
        error,
        pagination,
        loadProjects,
        handleDelete,
        getProject,
        getAllProjects,
    };
}