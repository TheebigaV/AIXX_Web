import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import RoleFrom from "@/components/roles/RoleForm";

export const metadata: Metadata = {
  title: "Next.js Roles Create Form",
  description:
    "This is Next.js Roles Create Form",
};

export default function RolesCreate() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Role Form" />
      <div className="w-full">
        <div className="space-y-6">
         <RoleFrom/>
        </div>
      </div>
    </div>
  );
}
