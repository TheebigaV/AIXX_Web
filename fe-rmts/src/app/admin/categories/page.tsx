import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryTableOne from "@/components/categories/CategoryTableOne";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Categories",
    description:
        "Categories table",
    // other metadata
};

export default function Categories() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Category"/>
            <div className="space-y-6">
                <ComponentCard title="Category"
                               permission="categories-create"
                               buttonName="Create Category"
                               link="categories/create">
                    <CategoryTableOne/>
                </ComponentCard>
            </div>
        </div>
    );
}
