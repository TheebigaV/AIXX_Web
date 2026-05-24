import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InquiriesTableOne from "@/components/inquiries/InquiriesTableOne";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "AIXX Application Inquiries",
    description: "AIXX Application Inquiries table",
    // other metadata
};

export default function Enquiries() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Enquiries"/>
            <div className="space-y-6">
                <ComponentCard title="Enquiries">
                    <InquiriesTableOne/>
                </ComponentCard>
            </div>
        </div>
    );
}