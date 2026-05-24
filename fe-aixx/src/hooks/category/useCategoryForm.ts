import { useState, useEffect } from "react";
import { CategoryFormData } from "@/types/category";
import { createCategory, updateCategory } from "@/lib/categories";
import useCategories from "@/hooks/category/useCategories";

export const useCategoryForm = (categoryId?: string, onSuccess?: () => void) => {
  const { getCategory } = useCategories();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    image: null, // Must be File | null
    is_active: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
      Partial<Record<keyof CategoryFormData, string>>
  >({});
  const [serverError, setServerError] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  // Load existing category for edit
  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      getCategory(categoryId)
          .then((res) => {
            setFormData({
              ...res.data,
              is_active: !!res.data.is_active,
            });
            if (res.data.image?.url) setExistingImageUrl(res.data.image.url);
          })
          .catch(() => setServerError("Failed to fetch category"))
          .finally(() => setLoading(false));
    }
  }, [categoryId]);

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.image && !existingImageUrl)
      newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validate()) return false;

    setLoading(true);
    try {
      const payload = new FormData();
      if (categoryId) {
        payload.append("_method", "PUT"); // important for Laravel update
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "image") {
            if (value instanceof File) {
              payload.append(key, value); // append only new file
            }
            // Do NOT append existing image object
          } else if (key === "is_active") {
            payload.append(key, value ? "1" : "0"); // boolean as 1/0
          } else {
            payload.append(key, value);
          }
        }
      });

      categoryId
          ? await updateCategory(categoryId, payload)
          : await createCategory(payload);

      if (onSuccess) onSuccess();
      return true;
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setServerError("Something went wrong");
      }
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
    existingImageUrl,
    handleChange,
    handleSubmit,
  };
};
