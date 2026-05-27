import { useEffect, useState } from "react";
import {
  fetchTrainings,
  deleteTraining,
  getTraining as getTrainingById,
  fetchAllTrainings,
} from "@/lib/training";

export default function useTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
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

  const loadTrainings = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      const res = await fetchTrainings(page, perPage);
      setTrainings(res.data.data);
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
        setError(err.response.data.message || "Something went wrong while loading trainings.");
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
      await deleteTraining(id);
      await loadTrainings();
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to delete training.");
        throw err;
      } else {
        setError("Network error.");
      }
    }
  };

  const getTraining = async (id: string) => {
    setError(null);
    try {
      const res = await getTrainingById(id);
      setSelectedTraining(res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error getting training:", err);
      setError(err?.response?.data?.message || "Failed to fetch training.");
      return null;
    }
  };

  const getAllTrainings = async () => {
    setError(null);
    try {
      const res = await fetchAllTrainings();
      setTrainings(res.data.data);
      return res.data || [];
    } catch (err: any) {
      console.error("Error fetching all trainings:", err);
      setError(err?.response?.data?.message || "Failed to fetch all trainings.");
      return [];
    }
  };

  return {
    trainings,
    selectedTraining,
    loading,
    error,
    pagination,
    loadTrainings,
    handleDelete,
    getTraining,
    getAllTrainings,
  };
}
