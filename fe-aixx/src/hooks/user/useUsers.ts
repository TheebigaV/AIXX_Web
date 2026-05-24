
import { useEffect, useState } from "react";
import { fetchUsers, deleteUser, getUser as getUserById, fetchAllUsers } from "@/lib/users";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from:0,
    to:0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const loadUsers = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      const res = await fetchUsers(page, perPage);
      setUsers(res.data.data);
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
        // Backend responded with error
        setError(err.response.data.message || "Something went wrong while loading users.");
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
      await deleteUser(id);
      await loadUsers();
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to delete user.");
        throw err;
      } else {
        setError("Network error.");
      }
    }
  };

  const getUser = async (id: string) => {
    setError(null);
    try {
      const res = await getUserById(id);
      setSelectedUser(res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error getting user:", err);
      setError(err?.response?.data?.message || "Failed to fetch user.");
      return null;
    }
  };


  const getAllUsers = async () => {
    setError(null);
    try {
      const res = await fetchAllUsers();
      return res.data || [];
    } catch (err: any) {
      console.error("Error fetching all users:", err);
      setError(err?.response?.data?.message || "Failed to fetch all users.");
      return [];
    }
  };

  return {
    users,
    selectedUser,
    loading,
    error,
    pagination,
    loadUsers,
    handleDelete,
    getUser,
    getAllUsers
  };
}