import { useState, useCallback } from "react";
import { fetchProjects, getProject as getProjectById, fetchAllProjects,   fetchRandomProjects 
 } from "@/lib/public/projects";

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

  // Fetch paginated projects
  const loadProjects = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    setError(null);
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
        err.response?.data?.message ||
        "Something went wrong while loading projects."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch single project by ID
  const getProject = async (id: string | number) => {
    setError(null);
    try {
      setLoading(true);
      const res = await getProjectById(id);
      setSelectedProject(res.data.data);
      return res.data.data;
    } catch (err: any) {
      console.error("Error getting project:", err);
      setError(err?.response?.data?.message || "Failed to fetch project.");
      return null;
    } finally {
      setLoading(false);
    }
  };

    // Fetch all projects
  const getAllProjects = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetchAllProjects();
      const projectsData = res.data?.data || res.data || [];
      setProjects(projectsData);
      return projectsData;
    } catch (err: any) {
      console.error("Error fetching all projects:", err);
      setError(err?.response?.data?.message || "Failed to fetch all projects.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

   // Fetch random projects
  // const loadRandomProjects = async (count: number = 3) => {
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const res = await fetchRandomProjects(count);
  //     setProjects(res.data?.data || res.data || []);
  //   } catch (err: any) {
  //     console.error("Error fetching random projects:", err);
  //     setError(err?.response?.data?.message || "Failed to fetch random projects.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch random projects (with exclusion support)
const loadRandomProjects = async (count: number = 3, excludeId?: string | number) => {
  setError(null);
  setLoading(true);
  try {
    const res = await fetchRandomProjects(count);
    let randomProjects = res.data?.data || res.data || [];
    
    // ✅ Filter out the current project if excludeId is provided
    if (excludeId) {
      randomProjects = randomProjects.filter(
        (p: any) => String(p.id) !== String(excludeId) && p.slug !== excludeId
      );
    }
    
    setProjects(randomProjects);
  } catch (err: any) {
    console.error("Error fetching random projects:", err);
    setError(err?.response?.data?.message || "Failed to fetch random projects.");
  } finally {
    setLoading(false);
  }
};

  // Fetch single project by slug or ID
  const getProjectbySlug = async (slugOrId: string) => {
    setError(null);
    try {
      setLoading(true);

      // Try to find project in already loaded projects
      let project = projects.find(
        p => p.slug === slugOrId || String(p.id) === slugOrId
      );

      // If not found, fetch all projects from API
      if (!project) {
        const allRes = await fetchAllProjects();
        const allProjects = allRes.data?.data || allRes.data || [];
        setProjects(allProjects);
        project = allProjects.find(
          (p: any) => p.slug === slugOrId || String(p.id) === slugOrId
        );
      }

      if (!project) throw new Error("Project not found");

      setSelectedProject(project);
      return project;
    } catch (err: any) {
      console.error("Error fetching project by slug or ID:", err);
      setError(err?.message || "Failed to fetch project.");
      setSelectedProject(null);
      return null;
    } finally {
      setLoading(false);
    }
  };


  return {
    projects,
    selectedProject,
    loading,
    error,
    pagination,
    loadProjects,
    getProject,
    getProjectbySlug,
    getAllProjects,
    loadRandomProjects,
  };
}
