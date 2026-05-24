'use client';

import React from 'react';
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi';
import BreadcrumbDynamic from './BreadcrumbDynamic';
import { ProjectTableData } from '@/types/project';

interface ProjectDetailBannerProps {
  projectData: ProjectTableData | null;
  loading: boolean;
  error: string | null;
}

const ProjectDetailBanner: React.FC<ProjectDetailBannerProps> = ({
  projectData,
  loading,
  error,
}) => {
  // ─── LOADING STATE ───
  if (loading) {
    return (
      <section className="relative w-full sm:h-[570px] md:h-[500px] 2xl:h-[524px]">
        <Image
          src="/images/home/futuristic_about.png"
          alt="Project Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#1a0b2e]/60 to-[#2e1065]/20 z-10" />
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="w-full sm:pb-[48px] lg:pb-[64px] xl:pb-[84px] container mx-auto sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px]">
            <div className="text-white ">
              <div className="h-6 bg-gray-300/20 rounded w-48 animate-pulse"></div>
              <div className="flex items-center gap-2 text-sm sm:text-base pb-[8px] text-gray-200">
                <FiCalendar className="w-5 h-5 text-white" />
                <div className="h-4 bg-gray-300/20 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-8 sm:h-10 md:h-12 bg-gray-300/20 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── ERROR STATE ───
  if (error || !projectData) {
    return (
      <section className="relative w-full sm:h-[570px] md:h-[500px] 2xl:h-[524px]">
        <Image
          src="/images/home/futuristic_about.png"
          alt="Project Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#1a0b2e]/60 to-[#2e1065]/20 z-10" />
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="w-full container mx-auto px-[16px] sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] sm:pb-[48px] lg:pb-[64px] xl:pb-[84px]">
            <div className="text-white ">
              <BreadcrumbDynamic
                type="project"
                slug={projectData?.categoryId || projectData?.slug || 'not-found'}
              />
              <h1 className="text-3xl sm:text-[28px] md:text-[32px] lg:text-[48px] xl:text-[48px] 2xl:text-[48px] font-medium text-red-400">
                Project Not Found
              </h1>
              {error && <p className="text-white/80">Error: {error}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── DYNAMIC DATA ───
  const displayImage =
    projectData.banner_image?.url ||
    '/images/home/futuristic_about.png';

  return (
    <section className="relative w-full sm:h-[570px] md:h-[500px] 2xl:h-[524px]">
      {/* ✅ Dynamic Background Image */}
      <Image
        src={displayImage}
        alt={`${projectData.title || 'Project'} Banner`}
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#00062A]/60 to-[#00062A]/20 z-10" />

      {/* Dynamic Content */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="w-full container mx-auto sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] sm:pb-[48px] lg:pb-[64px] xl:pb-[84px]">
          <div className="text-white ">
            {/* Breadcrumb */}
            <BreadcrumbDynamic
              type="project"
              slug={projectData.categoryId || projectData.slug}
              className="mb-[24px]"
            />

            {/* Date */}
            <div className="flex items-center gap-2 sm:text-[14px] md:text-[16px] text-gray-200 pb-[4px]">
              <FiCalendar className="w-5 h-5 text-white" />
              <span>{projectData.date || 'Date not available'}</span>
            </div>

            {/* Project Title */}
            <h1 className="text-3xl sm:text-[28px] md:text-[36px] lg:text-[48px] font-medium">
              {projectData.title || 'Untitled Project'}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailBanner;
