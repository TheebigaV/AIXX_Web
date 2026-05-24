"use client";

import React, {useEffect, useState} from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {useCategoryForm} from "@/hooks/category/useCategoryForm"; // 👈 new hook

export default function CategoryForm() {
    const {id: categoryId} = useParams();
    const router = useRouter();

    const {
        formData,
        errors,
        serverError,
        loading,
        handleChange,
        existingImageUrl,
        handleSubmit,
    } = useCategoryForm(categoryId as string, () => {
        toast.success("Category saved successfully!");
        router.push("/admin/categories");
    });

    const [imagePreview, setImagePreview] = useState<string>("");

    // Show preview when selecting file
    useEffect(() => {
        if (existingImageUrl) setImagePreview(existingImageUrl);
    }, [existingImageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleChange("image", file);
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    return (
        <ComponentCard title="Category Information">
            {serverError && <div className="mb-4 text-red-500">{serverError}</div>}

            <div className="space-y-6">
                {/* Name */}
                <div>
                    <Label>
                        Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={formData.name}
                        type="text"
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        hint={errors.name}
                        placeholder="Enter category name"
                    />
                </div>
                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <TextArea
                        value={formData.description}
                        onChange={(value: string) => handleChange("description", value)}
                        error={!!errors.description}
                        hint={errors.description}
                        placeholder="Enter description"
                    />
                </div>

                {/* Image */}
                <div>
                    <Label>
                        Category Image <span className="text-red-500">*</span>
                    </Label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500"
                    />
                    {errors.image && (
                        <span className="text-red-500 text-sm">{errors.image}</span>
                    )}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Category Preview"
                            className="mt-2 w-40 h-20 object-cover border"
                        />
                    )}
                </div>

                {/* Active Checkbox */}
                <div>
                    <Checkbox
                        checked={formData.is_active}
                        onChange={(checked) => handleChange("is_active", checked)}
                        label="Active"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/admin/categories")}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ComponentCard>
    );
}