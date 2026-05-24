import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import UserForm from "@/components/users/UserForm";

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit an existing user",
};



export default function UserEdit({ params }: PageProps) {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User"/>
      <div className="w-full">
        <div className="space-y-6">
          <UserForm />
        </div>
      </div>
    </div>
  );
}