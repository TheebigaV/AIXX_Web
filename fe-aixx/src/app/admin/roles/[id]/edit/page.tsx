import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import RoleFrom from "@/components/roles/RoleForm";

export const metadata: Metadata = {
    title: "Edit Role",
    description: "Edit an existing role",
};

export default function RoleEdit() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Role" />
            <div className="w-full">
                <div className="space-y-6">
                    <RoleFrom />
                </div>
            </div>
        </div>
    );
}
