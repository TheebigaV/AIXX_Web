"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import TrainingTableOne from "@/components/training/TrainingTableOne";
import { useSearchParams } from "next/navigation";

export default function TrainingSettingsPage() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams ? searchParams.get("type") : null;

  const getCardDetails = () => {
    if (typeFilter === "elearning") {
      return {
        title: "E-Learning Modules List",
        buttonName: "Create E-Learning Module",
        link: "training/create?type=elearning",
        pageTitle: "E-Learning Modules Management"
      };
    }
    if (typeFilter === "free_courses") {
      return {
        title: "Free AI Knowledge Certificates List",
        buttonName: "Create Free Certificate Program",
        link: "training/create?type=free_courses",
        pageTitle: "Free Certificates Management"
      };
    }
    if (typeFilter === "seminars") {
      return {
        title: "Seminars List",
        buttonName: "Create Seminar",
        link: "training/create?type=seminars",
        pageTitle: "Seminars Management"
      };
    }
    if (typeFilter === "workshops") {
      return {
        title: "Workshops List",
        buttonName: "Create Workshop",
        link: "training/create?type=workshops",
        pageTitle: "Workshops Management"
      };
    }
    if (typeFilter === "newsletters") {
      return {
        title: "AI-Hot News List",
        buttonName: "Create AI-Hot News",
        link: "training/create?type=newsletters",
        pageTitle: "AI-Hot News Management"
      };
    }
    if (typeFilter === "media_gallery") {
      return {
        title: "Training Media Gallery List",
        buttonName: "Create Media Gallery Item",
        link: "training/create?type=media_gallery",
        pageTitle: "Training Media Gallery Management"
      };
    }
    if (typeFilter === "certification") {
      return {
        title: "Skill Training & Certification List",
        buttonName: "Create Certification Item",
        link: "training/create?type=certification",
        pageTitle: "Skill Training & Certification Management"
      };
    }
    return {
      title: "Trainings & Courses List",
      buttonName: "Create Training Item",
      link: "training/create",
      pageTitle: "Training Management"
    };
  };

  const cardDetails = getCardDetails();

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={cardDetails.pageTitle} />

      <div className="space-y-6">
        <ComponentCard
          title={cardDetails.title}
          permission="training-create"
          buttonName={cardDetails.buttonName}
          link={cardDetails.link}
        >
          <TrainingTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
