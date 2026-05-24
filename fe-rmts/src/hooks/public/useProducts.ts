import { useCallback, useState } from "react";
import { fetchProducts, getProduct as getProductBySlug, fetchAllProducts } from "@/lib/public/products";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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

  // Memoize loadProducts with useCallback to prevent infinite loops
  const loadProducts = useCallback(async (
    page: number = 1,
    perPage: number = 10,
    category: string = '',
    search: string = ''
  ) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetchProducts(page, perPage, category, search);
      setProducts(res.data.data);
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
        setError(err.response.data.message || "Something went wrong while loading products.");
      } else {
        setError("Network error or server is not reachable.");
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on external values

  // Memoize getProduct with useCallback
  const getProduct = useCallback(async (id: string) => {
    setError(null);
    try {
      const res = await getProductBySlug(id);
      setSelectedProduct(res.data.data);
      return res.data;
    }
    catch (err: any) {
      console.error("Error getting product:", err);
      setError(err?.response?.data?.message || "Failed to fetch product.");
      return null;
    }
  }, []);

  // Memoize getAllProducts with useCallback
  const getAllProducts = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetchAllProducts();
      setProducts(res.data.data);
      return res.data.data;
    }
    catch (err: any) {
      console.error("Error getting all products:", err);
      setError(err?.response?.data?.message || "Failed to fetch products.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    selectedProduct,
    pagination,
    loading,
    error,
    loadProducts,
    getProduct,
    getAllProducts,
  };
}