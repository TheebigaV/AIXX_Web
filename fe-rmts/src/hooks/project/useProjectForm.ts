import { useState, useEffect } from "react";
import { createProject, updateProject, deleteProjectImage } from "@/lib/projects";
import useProjects from "@/hooks/project/useProjects";
import { ProjectFormData } from "@/types/project";

export const useProjectForm = (projectId?: string, onSuccess?: () => void) => {
    const { getProject } = useProjects();

    const [formData, setFormData] = useState<Omit<ProjectFormData, "images">>({
        title: "",
        description: "",
        date: "",
        is_active: false,
        thumbnail_image: "",
        banner_image: "",

    });
    const [existingThumbnailImage, setExistingThumbnailImage] = useState<string | null>(null);
    const [existingBannerImage, setExistingBannerImage] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<ProjectImage[]>([]); // URLs of existing images
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
    const [serverError, setServerError] = useState("");

    // Load project
    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        getProject(projectId)
            .then((res) => {
                if (!res) return;

                const data = res.data;

                setFormData({
                    ...data,
                    thumbnail_image: "",
                    banner_image: "",
                });

                // Load existing images
                if (data.thumbnail_image?.url)
                    setExistingThumbnailImage(data.thumbnail_image.url);

                if (data.banner_image?.url)
                    setExistingBannerImage(data.banner_image.url);

                if (data.images?.length)
                    setExistingImages(data.images);
            })
            .catch((error) => {
                console.error("Failed to fetch project:", error);
                setServerError("Failed to fetch project details.");
            })
            .finally(() => setLoading(false));
    }, [projectId]);


    const validate = () => {
        const newErrors: typeof errors = {};

        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.description) newErrors.description = "Description is required";

        if (!projectId && !formData.thumbnail_image) {
            newErrors.thumbnail_image = "Thumbnail image is required";
        } else if (projectId && !formData.thumbnail_image && !existingThumbnailImage) {
            newErrors.thumbnail_image = "Thumbnail image is required";
        }

        if (!projectId && !formData.banner_image) {
            newErrors.banner_image = "Banner image is required";
        } else if (projectId && !formData.banner_image && !existingBannerImage) {
            newErrors.banner_image = "Banner image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // Input change
    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // Remove existing image
    const removeExistingImage = async (imageId: number) => {
        try {
            await deleteProjectImage(projectId!, imageId); // backend API call
            setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        } catch (err) {
            console.error("Failed to delete image:", err);
            setServerError("Failed to remove image. Try again.");
        }
    };

    // Submit
    const handleSubmit = async (newImages: File[] = []) => {
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = new FormData();
            if (projectId) payload.append("_method", "PUT");

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "thumbnail_image" || key === "banner_image") {
                    if (value instanceof File) {
                        payload.append(key, value);
                    }
                    return;
                }

                if (key === "images") return; // handled separately below

                if (key === "is_active") {
                    payload.append(key, value ? "1" : "0");
                } else if (value !== null && value !== undefined) {
                    payload.append(key, value);
                }
            });

            console.log('newImages1', newImages);

            if (newImages.length > 0) {
                newImages.forEach((file) => payload.append("images[]", file));
            }

            projectId
                ? await updateProject(projectId, payload)
                : await createProject(payload);

            if (onSuccess) onSuccess();
        } catch (err: any) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setServerError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return {
        formData,
        errors,
        serverError,
        loading,
        existingThumbnailImage,
        existingBannerImage,
        existingImages,
        handleChange,
        setErrors,
        removeExistingImage,
        handleSubmit,
    };
};
