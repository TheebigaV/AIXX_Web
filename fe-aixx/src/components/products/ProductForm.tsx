"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Checkbox from "../form/input/Checkbox";

import RichTextEditor from "../common/RichTextEditor";
import useCategories from "@/hooks/category/useCategories";
import { useProductForm } from "@/hooks/product/useProductForm";
import { CategoriesData } from "@/types/category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

type ImageValue = string | { url?: string | null; file_name?: string | null } | null | undefined;

const resolveStorageUrl = (value?: ImageValue) => {
  const url = typeof value === "string" ? value : value?.url || value?.file_name || "";
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("/images/")) return url;
  if (url.startsWith("/storage")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/storage/${url.replace(/^public\//, "")}`;
};

export default function ProductForm() {
  const { id: productId } = useParams();
  const router = useRouter();

  const {
    formData,
    errors,
    serverError,
    loading,
    existingMainImage,
    handleChange,
    handleSubmit,
    setErrors,
  } = useProductForm(productId as string, () => {
    toast.success("Product saved successfully!");
    router.push("/admin/products");
  });

  const { categories, getAllCategories } = useCategories();

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [addToInnovative, setAddToInnovative] = useState(false);
  const [innovativeCategoryId, setInnovativeCategoryId] = useState<number | null>(null);

  const [mainImagePreview, setMainImagePreview] = useState<string>("");

  // Load categories and detect innovative-products
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      const res = await getAllCategories();
      setCategoriesLoading(false);
      const categoriesArray = Array.isArray(res) ? res : res?.data || [];
      const found = categoriesArray.find(
        (c: any) => c.slug === "innovative-products" || c.name?.toLowerCase() === "innovative products"
      );
      if (found) {
        setInnovativeCategoryId(found.id);
        if (formData.category_id && Number(formData.category_id) === found.id) setAddToInnovative(true);
      }
    };
    fetchCategories();
  }, []);

  // Preview existing main image
  useEffect(() => {
    if (existingMainImage) setMainImagePreview(resolveStorageUrl(existingMainImage));
  }, [existingMainImage]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange("main_product_image", file);
    if (file) setMainImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async () => {
    await handleSubmit([]); // No sub‑images
  };

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
          <Label>
            Main Product Image <span className="text-red-500">*</span>
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="mt-1 block w-full text-sm text-gray-500"
          />
          {errors.main_product_image && <p className="text-red-500">{errors.main_product_image}</p>}
          {mainImagePreview && (
            <img src={mainImagePreview} alt="Product Main Image Preview" className="w-24 h-24 object-cover border" />
          )}
        </div>

        {/* Active */}
        <div>
          <Checkbox checked={formData.is_active} onChange={(c) => handleChange("is_active", c)} label="Active" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
        </div>
      </div>
    </ComponentCard>
  );
}
