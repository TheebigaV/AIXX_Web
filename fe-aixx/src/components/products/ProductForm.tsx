"use client";

import React, {useEffect, useState} from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "@/components/ui/button/Button";
import {useRouter, useParams} from "next/navigation";
import {toast} from "react-toastify";
import Checkbox from "../form/input/Checkbox";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RichTextEditor from "../common/RichTextEditor";
import useCategories from "@/hooks/category/useCategories";
import {useProductForm} from "@/hooks/product/useProductForm";
import {CategoriesData} from "@/types/categories";

export default function ProductForm() {
    const {id: productId} = useParams();
    const router = useRouter();

    const {
        formData,
        errors,
        serverError,
        loading,
        existingMainImage,
        existingSubImages,
        handleChange,
        removeExistingImage,
        handleSubmit,
        setErrors,
    } = useProductForm(productId as string, () => {
        toast.success("Product saved successfully!");
        router.push("/admin/products");
    });

    const {categories, getAllCategories}: { categories: CategoriesData[]; getAllCategories: () => void } =
        useCategories();

    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Local state for new images
    const [mainImage, setMainImage] = useState<string>("");
    const [mainImagePreview, setMainImagePreview] = useState<string>("");

    const [subImages, setSubImages] = useState<File[]>([]);
    const [subImagesPreview, setSubImagesPreview] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            await getAllCategories();
            setCategoriesLoading(false);
        };
        fetchCategories();
    }, []);

    // Main image preview
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleChange("main_product_image", file);
        if (file) setMainImagePreview(URL.createObjectURL(file));
    };

    // Sub images preview
    const handleSubImagesChange = (files: FileList | null) => {
        if (!files) return;
        const totalSelected = existingSubImages.length + subImages.length + files.length;
        if (totalSelected > 3) {
            setErrors((prev) => ({
                ...prev,
                sub_product_images: "Maximum 3 sub-product images allowed",
            }));
            return;
        }
        const fileArray = Array.from(files);
        setSubImages((prev) => [...prev, ...fileArray]);
        setSubImagesPreview((prev) => [...prev, ...fileArray.map((file) => URL.createObjectURL(file))]);
        setErrors((prev) => ({ ...prev, sub_product_images: undefined }));

    };

    // Remove new image
    const removeNewImage = (index: number) => {
        setSubImages((prev) => prev.filter((_, i) => i !== index));
        setSubImagesPreview((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async () => {
        await handleSubmit(subImages);
    };

    useEffect(() => {
        if (existingMainImage) setMainImagePreview(existingMainImage);
    }, [existingMainImage]);

    useEffect(() => {
        console.log("Updated setMainImagePreview:", existingMainImage);
    }, [existingMainImage]);

    return (
        <ComponentCard title={productId ? "Edit Product" : "Create Product"}>
            {serverError && <p className="text-red-500">{serverError}</p>}

            <div className="space-y-6">
                {/* Product Name */}
                <div>
                    <Label>
                        Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={formData.name || ""}
                        type="text"
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        hint={errors.name}
                        placeholder="Enter product name"
                    />
                </div>

                {/* Category */}
                {categoriesLoading ? (
                    <LoadingSpinner message="Loading categories..."/>
                ) : (
                    <div>
                        <Label>
                            Category <span className="text-red-500">*</span>
                        </Label>
                        <select
                            value={formData.category_id || ""}
                            onChange={(e) => handleChange("category_id", e.target.value)}
                            className={`w-full rounded border px-3 py-2 text-sm ${
                                errors.category_id ? "border-red-500" : "border-gray-300"
                            }`}
                        >
                            <option value="">-- Select Category --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                    </div>
                )}

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <RichTextEditor
                        value={formData.description || ""}
                        onChange={(value) => handleChange("description", value)}
                        error={!!errors.description}
                        hint={errors.description}
                        placeholder="Enter description"
                        height="200px"
                    />
                </div>

                {/* Main Image */}
                <div>
                    <Label>Main Product Image <span className="text-red-500">*</span></Label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="mt-1 block w-full text-sm text-gray-500"
                    />
                    {errors.main_product_image && <p className="text-red-500">{errors.main_product_image}</p>}
                    {mainImagePreview && (
                        <img
                            src={mainImagePreview}
                            alt="Product Main Image Preview"
                            className="w-24 h-24 object-cover border"
                        />
                    )}
                </div>

                {/* Sub Images */}
                <div>
                    <Label>Sub Product Images</Label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleSubImagesChange(e.target.files)}
                        className="mt-1 block w-full text-sm text-gray-500"
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {/* Preview new sub images */}

                        {subImagesPreview.map((src, idx) => (
                            <div key={`new-${idx}`}
                                 className="relative w-24 h-24">
                                <img key={idx} src={src} className="w-24 h-24 object-cover border" alt={`Sub ${idx}`}/>
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}


                        {/* Existing sub images */}
                        {existingSubImages.map((img) => (
                            <div key={img.id} className="relative w-24 h-24">
                                <img src={img.url} className="w-24 h-24 object-cover border" alt="Existing Sub"/>
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(img.id)}
                                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.sub_product_images && <p className="text-red-500">{errors.sub_product_images}</p>}
                </div>

                {/* Active */}
                <div>
                    <Checkbox
                        checked={formData.is_active}
                        onChange={(checked) => handleChange("is_active", checked)}
                        label="Active"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <Button onClick={onSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/admin/products")}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ComponentCard>
    );
}
