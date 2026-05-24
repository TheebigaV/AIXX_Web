import {useState, useEffect} from "react";
import {createProduct, updateProduct, deleteProductImage} from "@/lib/products";
import useProducts from "@/hooks/product/useProducts";

interface ProductFormData {
    name: string;
    category_id: string;
    description: string;
    is_active: boolean;
    main_product_image: File | null; // single main image
    sub_product_images: File[]; // multiple sub images
}

export const useProductForm = (
    productId?: string,
    onSuccess?: () => void
) => {
    const {getProduct} = useProducts();

    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        category_id: "",
        description: "",
        is_active: false,
        main_product_image: null,
        sub_product_images: [],
    });

    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
    const [existingSubImages, setExistingSubImages] = useState<{ id: number, url: string }[]>([]);// existing images from backend
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    // Load product for edit
    useEffect(() => {
        if (!productId) return;
        setLoading(true);
        getProduct(productId)
            .then((res) => {
                if (res) {
                    setFormData({
                        ...res.data,
                        main_product_image: null, // keep null, use existing image
                        sub_product_images: [],
                    });
                    if (res.data.main_product_image?.url) setExistingMainImage(res.data.main_product_image.url);
                    if (res.data.sub_product_images?.length) setExistingSubImages(res.data.sub_product_images);
                }
            })
            .catch(() => setServerError("Failed to fetch product"))
            .finally(() => setLoading(false));
    }, [productId]);

    // Validation
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.category_id) newErrors.category_id = "Category is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.main_product_image && existingMainImage.length === 0) newErrors.main_product_image = "Main product image is required";

         if (!formData.main_product_image && !existingMainImage) {
            newErrors.main_product_image = "Main product image is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof ProductFormData, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const removeExistingImage = async (imageId: number) => {
        try {
            await deleteProductImage(productId!, imageId); // backend API call
            setExistingSubImages((prev) => prev.filter((img) => img.id !== imageId));
        } catch (err) {
            console.error("Failed to delete image:", err);
            setServerError("Failed to remove image. Try again.");
        }
    };

    const handleSubmit = async (newImages: File[] = []) => {
        if (!validate()) return;
        setLoading(true);

        try {
            const payload = new FormData();
            if (productId) payload.append("_method", "PUT");

            // Append normal fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "main_product_image") {
                    if (value instanceof File) {
                        payload.append(key, value); // append only new file
                    }
                    // Do NOT append existing image object
                }
                if (key === "sub_product_images") return;
                if (key === "is_active") payload.append(key, value ? "1" : "0");
                else if (value !== null && value !== undefined) payload.append(key, value);
            });

            // Append new images
            if (newImages.length > 0) {
                newImages.forEach((file) => payload.append("sub_product_images[]", file));
            }

            // API call
            productId
                ? await updateProduct(productId, payload)
                : await createProduct(payload);

            if (onSuccess) onSuccess();
            return true;
        } catch (err: any) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setServerError("Something went wrong");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        serverError,
        loading,
        existingMainImage,
        existingSubImages,
        handleChange,
        setErrors,
        removeExistingImage,
        handleSubmit,
    };
};
