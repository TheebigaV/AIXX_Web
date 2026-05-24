import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTableOne from "@/components/users/UserTableOne";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "AIXX Application Users",
    description:
        "AIXX Application Users table",
    // other metadata
};

export default function Users() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Users"/>
            <div className="space-y-6">
                <ComponentCard title="Users"
                               permission="users-create"
                               buttonName="Create User"
                               link="users/create">
                    <UserTableOne/>
                </ComponentCard>
            </div>
        </div>
    );
}
