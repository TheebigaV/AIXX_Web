import { useState, useEffect } from "react";
import { BannerFormData } from "@/types/banner";
import { createBanner, updateBanner } from "@/lib/banners";
import useBanners from "@/hooks/banner/useBanners";

export const useBannerForm = (bannerId?: string, onSuccess?: () => void) => {
    const { getBanner } = useBanners();

    const [formData, setFormData] = useState<BannerFormData>({
        page: "home",
        title_1: "",
        title_2: "",
        link: "",
        subtitle: "",
        image: null, // Must be File | null
        is_active: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof BannerFormData, string>>>({});
    const [serverError, setServerError] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");

    // Load existing banner for edit
    useEffect(() => {
        if (bannerId) {
            setLoading(true);
            getBanner(bannerId)
                .then((res) => {
                    setFormData({
                        ...res.data,
                        is_active: !!res.data.is_active
                    });
                    if (res.data.image?.url) setExistingImageUrl(res.data.image.url);
                    
                })
                .catch(() => setServerError("Failed to fetch banner"))
                .finally(() => setLoading(false));
        }
    }, [bannerId]);

    // Validation
    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.title_1) newErrors.title_1 = "Title is required";
        if (!formData.image && !existingImageUrl) newErrors.image = "Image is required";
        if (formData.link) {
            try {
                new URL(formData.link);
            } catch {
                newErrors.link = "Link must be a valid URL";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input change
    const handleChange = (field: keyof BannerFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // Submit form
    const handleSubmit = async () => {
        if (!validate()) return false;

        setLoading(true);
        try {
            const payload = new FormData();
            if (bannerId) {
                payload.append('_method', 'PUT'); // important for Laravel update
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
                        payload.append(key, value); // other fields
                    }
                }
            });

            console.log("Form data before submit:", formData);
            console.log("payload data before submit:", payload);

            bannerId
                ? await updateBanner(bannerId, payload)
                : await createBanner(payload);

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