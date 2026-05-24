"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import RichTextEditor from "../common/RichTextEditor";
import Checkbox from "../form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useProjectForm } from "@/hooks/project/useProjectForm";

export default function ProjectForm() {
  const { id: projectId } = useParams();
  const router = useRouter();

  const {
    formData,
    errors,
    serverError,
    loading,
    existingThumbnailImage,
    existingBannerImage,
    existingImages,
    handleChange,
    removeExistingImage,
    handleSubmit,
  } = useProjectForm(projectId as string, () => {
    toast.success("Project saved successfully!");
    router.push("/admin/projects");
  });

  // ─── IMAGE STATES ───
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string>("");
  const [bannerImagePreview, setBannerImagePreview] = useState<string>("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // ─── HANDLERS ───

  // Thumbnail image upload
  const handleThumbnailImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange("thumbnail_image", file);
    if (file) setThumbnailImagePreview(URL.createObjectURL(file));
  };

  // Banner image upload
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange("banner_image", file);
    if (file) setBannerImagePreview(URL.createObjectURL(file));
  };

  // Multiple images upload
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setNewImages((prev) => [...prev, ...fileArray]);
    setPreviews((prev) => [...prev, ...fileArray.map((file) => URL.createObjectURL(file))]);
  };

  // Remove new gallery image
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── CLEANUP ───
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // ─── LOAD EXISTING IMAGES ───
  useEffect(() => {
    if (existingThumbnailImage) setThumbnailImagePreview(existingThumbnailImage);
  }, [existingThumbnailImage]);

  useEffect(() => {
    if (existingBannerImage) setBannerImagePreview(existingBannerImage);
  }, [existingBannerImage]);

  // ─── SUBMIT ───
  const onSubmit = async () => {
    await handleSubmit(newImages);
  };

  return (
    <ComponentCard title={projectId ? "Edit Project" : "Create Project"}>
      {serverError && <div className="mb-4 text-red-500">{serverError}</div>}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label>
            Project Title <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.title}
            type="text"
            onChange={(e) => handleChange("title", e.target.value)}
            error={!!errors.title}
            hint={errors.title}
            placeholder="Enter project title"
          />
        </div>

        {/* Date */}
        <div>
          <Label>
            Project Date <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.date}
            type="date"
            onChange={(e) => handleChange("date", e.target.value)}
            error={!!errors.date}
            hint={errors.date}
          />
        </div>

        {/* Description */}
        <div>
          <Label>
            Description <span className="text-red-500">*</span>
          </Label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            error={!!errors.description}
            hint={errors.description}
            placeholder="Enter project description"
            height="200px"
          />
        </div>

        {/* Thumbnail Image */}
        <div>
          <Label>
            Thumbnail Image <span className="text-red-500">*</span>
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailImageChange}
            className="mt-1 block w-full text-sm text-gray-500"
          />
          {errors.thumbnail_image && (
            <p className="text-red-500">{errors.thumbnail_image}</p>
          )}
          {thumbnailImagePreview && (
            <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden flex items-center justify-center">
              <img
                src={thumbnailImagePreview}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Banner Image */}
        <div>
          <Label>
            Banner Image <span className="text-red-500">*</span>
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerImageChange}
            className="mt-1 block w-full text-sm text-gray-500"
          />
          {errors.banner_image && (
            <p className="text-red-500">{errors.banner_image}</p>
          )}
          {bannerImagePreview && (
            <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden flex items-center justify-center">
              <img
                src={bannerImagePreview}
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Project Images */}
        <div>
          <Label>Project Images</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500"
          />

          <div className="flex flex-wrap gap-4 mt-2">
            {/* Existing Images */}
            {existingImages.map((img) => (
              <div
                key={img.id}
                className="relative w-32 h-32 border rounded overflow-hidden flex items-center justify-center"
              >
                <img src={img.url} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}

            {/* New Images */}
            {previews.map((url, i) => (
              <div
                key={`new-${i}`}
                className="relative w-32 h-32 border rounded overflow-hidden flex items-center justify-center"
              >
                <img src={url} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
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
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
        