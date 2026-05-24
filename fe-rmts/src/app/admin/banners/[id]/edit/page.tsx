import React from 'react'
import BannerForm from "@/components/banner/BannerForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Form",
    description: "Edit an existing form",
};

export default function BannerEdit() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Banner" />
            <div className="w-full">
                <div className="space-y-6">
                    <BannerForm />
                </div>
            </div>
        </div>
    );
}