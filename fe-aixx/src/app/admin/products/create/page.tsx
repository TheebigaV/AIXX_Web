import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import ProductForm from "@/components/products/ProductForm";

export default function ProductCreate() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Product" />
      <div className="w-full">
        <div className="space-y-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
