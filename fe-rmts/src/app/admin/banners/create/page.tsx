import BannerForm from "@/components/banner/BannerForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Create Form",
    description:
        "This is Next.js Create Form",
};

export default function  BannerCreate() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Banner Form" />
        <div className="w-full">
            <div className="space-y-6">
                <BannerForm/>
            </div>
        </div>
    </div>
  )
}