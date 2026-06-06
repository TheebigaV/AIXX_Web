import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import ProductForm from "@/components/products/ProductForm";

export const metadata = {
  title: "Edit Product",
  description: "Edit an existing product",
};

export default function ProductEdit() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Product" />
      <div className="w-full">
        <div className="space-y-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
