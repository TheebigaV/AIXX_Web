"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useBannerForm } from "@/hooks/banner/useBannerForm";

export default function BannerForm() {
    const { id: bannerId } = useParams();
    const router = useRouter();

    const {
        formData,
        errors,
        serverError,
        loading,
        handleChange,
        existingImageUrl,
        handleSubmit,
    } = useBannerForm(bannerId as string, () => {
        toast.success("Banner saved successfully!");
        router.push("/admin/banners");
    });

    const [imagePreview, setImagePreview] = useState<string>("");


    // Show preview when selecting file
    useEffect(() => {
        console.log('existingImageUrl', existingImageUrl)
        if (existingImageUrl) setImagePreview(existingImageUrl);
    }, [existingImageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleChange("image", file);
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    return (
        <ComponentCard title="Banner Information">
            {serverError && <div className="mb-4 text-red-500">{serverError}</div>}

            <div className="space-y-6">
                <div>
                    <Label>Page <span className="text-red-500">*</span></Label>
                    <select
                        value={formData.page}
                        onChange={(e) => handleChange("page", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 outline-none focus:border-brand-500 dark:border-white/10"
                    >
                        <option value="home">Home Page Banner</option>
                        <option value="about">About Us Page Banner</option>
                        <option value="services">Services Page Banner</option>
                        <option value="contact">Contact Us Page Banner</option>
                        <option value="home_about">Home - About Section</option>
                        <option value="home_contact">Home - Contact Section</option>
                        <option value="contact_details">Contact Page Details (Phone/Email/Address)</option>
                    </select>
                </div>

                <div>
                    <Label>Title 1 <span className="text-red-500">*</span></Label>
                    <Input
                        value={formData.title_1}
                        type="text"
                        onChange={(e) => handleChange("title_1", e.target.value)}
                        error={!!errors.title_1}
                        hint={errors.title_1}
                        placeholder="Enter main title"
                    />
                </div>

                <div>
                    <Label>Title 2</Label>
                    <Input
                        value={formData.title_2}
                        type="text"
                        onChange={(e) => handleChange("title_2", e.target.value)}
                        error={!!errors.title_2}
                        hint={errors.title_2}
                        placeholder="Enter secondary title"
                    />
                </div>

                <div>
                    <Label>Subtitle</Label>
                    <TextArea
                        value={formData.subtitle}
                        onChange={(value: string) => handleChange("subtitle", value)}
                        error={!!errors.subtitle}
                        hint={errors.subtitle}
                        placeholder="Enter subtitle"
                    />
                </div>

                <div>
                    <Label>Link</Label>
                    <Input
                        value={formData.link || ""}
                        type="text"
                        onChange={(e) => handleChange("link", e.target.value)}
                        error={!!errors.link}
                        hint={errors.link}
                        placeholder="Enter optional link"
                    />
                </div>

                <div>
                    <Label>Banner Image <span className="text-red-500">*</span></Label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500"
                    />
                    {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Banner Preview"
                            className="mt-2 w-40 h-20 object-cover border"
                        />
                    )}
                </div>

                <div>
                    <Checkbox
                        checked={formData.is_active}
                        onChange={(checked) => handleChange("is_active", checked)}
                        label="Active"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/admin/banners")}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </ComponentCard>
    );
}