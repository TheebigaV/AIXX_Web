import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import CategoryForm from "@/components/categories/CategoryForm";

export const metadata: Metadata = {
    title: "Create Form",
    description: "This is Next.js Categories Create Form",
};

export default function CategoryCreate() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Category"/>
            <div className="w-full">
                <div className="space-y-6">
                    <CategoryForm/>
                </div>
            </div>
        </div>
    );
}
