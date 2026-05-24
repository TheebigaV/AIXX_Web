import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoleTableOne from "@/components/roles/RoleTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AIXX Application Roles",
  description:
    "AIXX Application Roles table",
  // other metadata
};

export default function Projects() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard title="Roles"
                       permission="roles-create"
                       buttonName="Create Roles"
                       link="roles/create">
          <RoleTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
