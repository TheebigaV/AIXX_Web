import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import React from "react";
import UserForm from "@/components/users/UserForm";

export const metadata: Metadata = {
    title: "Next.js Users Create Form",
    description:
        "This is Next.js Users Create Form",
};

export default function UsersCreate() {
    return (
        <div>
            <PageBreadcrumb pageTitle="User Form"/>
            <div className="w-full">
                <div className="space-y-6">
                    <UserForm/>
                </div>
            </div>
        </div>
    );
}
