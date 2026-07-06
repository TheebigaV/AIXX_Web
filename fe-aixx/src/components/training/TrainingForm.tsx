"use client";

import React, {useEffect, useState} from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import Select from "../form/input/Select";
import Button from "@/components/ui/button/Button";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {useTrainingForm} from "@/hooks/training/useTrainingForm";

export default function TrainingForm() {
    const {id: trainingId} = useParams();
    const router = useRouter();

    const {
        formData,
        errors,
        serverError,
        loading,
        handleChange,
        existingImageUrl,
        handleSubmit,
    } = useTrainingForm(trainingId as string, () => {
        toast.success("Training saved successfully!");
        router.push("/admin/training");
    });

    const [imagePreview, setImagePreview] = useState<string>("");
    // Show preview when selecting file or load existing image URL
    useEffect(() => {
        if (existingImageUrl) setImagePreview(existingImageUrl);
    }, [existingImageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleChange("image", file);
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    const typeOptions = [
        { value: "seminars", label: "Seminars" },
        { value: "workshops", label: "Workshops" },
        { value: "courses", label: "Courses" },
        { value: "certification", label: "Skill Training & Certification" },
        { value: "newsletters", label: "Latest Technology News" },
        { value: "media_gallery", label: "Training Media Gallery" }
    ];

    const showCourseDetails = formData.type === "courses";

    return (
        <ComponentCard title="Training Information">
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
                        placeholder="Enter training name"
                    />
                </div>

                {/* Type */}
                <div>
                    <Label>
                        Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.type}
                        onChange={(val) => handleChange("type", val)}
                        options={typeOptions}
                        error={!!errors.type}
                        hint={errors.type}
                        placeholder="Select training type"
                    />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <TextArea
                        value={formData.description || ""}
                        onChange={(value: string) => handleChange("description", value)}
                        error={!!errors.description}
                        hint={errors.description}
                        placeholder="Enter description"
                    />
                </div>

                {/* More info / program details */}
                {showCourseDetails && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        <div className="mb-4">
                            <Label>More info / program details</Label>
                            <p className="mt-1 text-sm text-slate-600">
                                Use this section to populate the details shown on the public “More info” page for this course.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <Label>Duration</Label>
                                <Input
                                    value={formData.duration || ""}
                                    type="text"
                                    onChange={(e) => handleChange("duration", e.target.value)}
                                    placeholder="e.g. Contact us for the schedule"
                                />
                            </div>
                            <div>
                                <Label>Domestic Fees</Label>
                                <Input
                                    value={formData.domestic_fee || ""}
                                    type="text"
                                    onChange={(e) => handleChange("domestic_fee", e.target.value)}
                                    placeholder="e.g. Contact us for pricing"
                                />
                            </div>
                            <div>
                                <Label>International Fees</Label>
                                <Input
                                    value={formData.international_fee || ""}
                                    type="text"
                                    onChange={(e) => handleChange("international_fee", e.target.value)}
                                    placeholder="e.g. Contact us for pricing"
                                />
                            </div>
                            <div>
                                <Label>Sub-modules</Label>
                                <TextArea
                                    value={formData.sub_modules || ""}
                                    onChange={(value: string) => handleChange("sub_modules", value)}
                                    placeholder="Enter one module per line"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label>Highlights</Label>
                            <TextArea
                                value={formData.highlights || ""}
                                onChange={(value: string) => handleChange("highlights", value)}
                                placeholder="Enter one highlight per line"
                            />
                        </div>
                    </div>
                )}

                {/* Image */}
                    <div>
                        <Label>Training Image</Label>
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
                                alt="Training Preview"
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
                    <Button variant="outline" onClick={() => router.push("/admin/training")}>
                        Cancel
                    </Button>
                </div>
            </div>
        </ComponentCard>
    );
}
