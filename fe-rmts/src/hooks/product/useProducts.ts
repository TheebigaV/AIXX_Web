import {useEffect, useState} from "react";
import {
    fetchProducts,
    deleteProduct,
    getProduct as getProductById,
    fetchAllProducts,
} from "@/lib/products";

export default function useProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // ✅ NEW
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

    const loadProducts = async (page: number = 1, perPage: number = 10, categoryId?: string | null) => {
        setLoading(true);
        try {
            const res = await fetchProducts(page, perPage  , categoryId);
            setProducts(res.data.data);
            setPagination({
                current_page: res.data.meta.current_page,
                last_page: res.data.meta.last_page,
                per_page: res.data.meta.per_page,
                total: res.data.meta.total,
                from: res.data.meta.from,
                to: res.data.meta.to,
            });
            setSelectedCategoryId(categoryId || null);

        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Something went wrong while loading products.");
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
            await deleteProduct(id);
            await loadProducts(pagination.current_page, pagination.per_page, selectedCategoryId);
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Failed to delete product.");
                throw err;
            } else {
                setError("Network error.");
            }
        }
    };

    const getProduct = async (id: string) => {
        setError(null);
        try {
            const res = await getProductById(id);
            setSelectedProduct(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Error getting product:", err);
            setError(err?.response?.data?.message || "Failed to fetch product.");
            return null;
        }
    };

    const getAllProducts = async () => {
        setError(null);
        try {
            const res = await fetchAllProducts();
            return res.data || [];
        } catch (err: any) {
            console.error("Error fetching all products:", err);
            setError(err?.response?.data?.message || "Failed to fetch all products.");
            return [];
        }
    };

    return {
        products,
        selectedProduct,
        selectedCategoryId, // ✅ Export this
        loading,
        error,
        pagination,
        loadProducts,
        handleDelete,
        getProduct,
        getAllProducts,
    };
}
