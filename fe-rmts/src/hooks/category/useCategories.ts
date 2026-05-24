import { useEffect, useState } from "react";
import {
  fetchCategories,
  deleteCategory,
  getCategory as getCategoryById,
  fetchAllCategories,
} from "@/lib/categories";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
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

  const loadCategories = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      const res = await fetchCategories(page, perPage);
      setCategories(res.data.data);
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
        setError(err.response.data.message || "Something went wrong while loading categories.");
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
      await deleteCategory(id);
      await loadCategories();
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to delete category.");
        throw err;
      } else {
        setError("Network error.");
      }
    }
  };

  const getCategory = async (id: string) => {
    setError(null);
    try {
      const res = await getCategoryById(id);
      setSelectedCategory(res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error getting category:", err);
      setError(err?.response?.data?.message || "Failed to fetch category.");
      return null;
    }
  };

  const getAllCategories = async () => {
    setError(null);
    try {
      const res = await fetchAllCategories();
      setCategories(res.data.data);
      return res.data || [];
    } catch (err: any) {
      console.error("Error fetching all categories:", err);
      setError(err?.response?.data?.message || "Failed to fetch all categories.");
      return [];
    }
  };

  return {
    categories,
    selectedCategory,
    loading,
    error,
    pagination,
    loadCategories,
    handleDelete,
    getCategory,
    getAllCategories,
  };
}
