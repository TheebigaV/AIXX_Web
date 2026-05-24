import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import CategoryForm from "@/components/categories/CategoryForm";

export const metadata: Metadata = {
    title: "Edit Category",
    description: "Edit an existing category",
};

export default function CategoryEdit() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Category"/>
            <div className="w-full">
                <div className="space-y-6">
                    <CategoryForm/>
                </div>
            </div>
        </div>
    );
}
