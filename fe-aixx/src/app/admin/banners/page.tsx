import React from "react";

import BannerTableOne from "@/components/banner/BannerTableOne";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

import {Metadata} from "next";

export const metadata: Metadata = {
    title: "AIXX Application Banners",
    description:
        "AIXX Application Banners table",
    // other metadata
};

export default function SavedBannersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Banners"/>
            <div className="space-y-6">
                <ComponentCard
                    title="Banners"
                    permission="banners-create"
                    buttonName="Create Banner"
                    link="banners/create">
                    <BannerTableOne/>
                </ComponentCard>
            </div>
        </div>
    );
}