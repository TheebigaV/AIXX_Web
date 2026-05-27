import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import TrainingForm from "@/components/training/TrainingForm";

export const metadata: Metadata = {
    title: "Create Training",
    description: "Create a new Training Item",
};

export default function TrainingCreate() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Create Training"/>
            <div className="w-full">
                <div className="space-y-6">
                    <TrainingForm/>
                </div>
            </div>
        </div>
    );
}
