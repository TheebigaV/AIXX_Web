import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Metadata} from "next";
import TrainingForm from "@/components/training/TrainingForm";

export const metadata: Metadata = {
    title: "Edit Training",
    description: "Edit an existing training item",
};

export default function TrainingEdit() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Training"/>
            <div className="w-full">
                <div className="space-y-6">
                    <TrainingForm/>
                </div>
            </div>
        </div>
    );
}
