'use client';

import React from 'react';
import Image from 'next/image';
import Breadcrumb from './Breadcrumb';

interface ProjectBannerProps {
  projectData?: {
    title?: string;
    description?: string;
    image?: string;
  };
  isProjectDetail?: boolean;
}

import useBanners from "@/hooks/public/useBanners";
import { useEffect, useMemo } from "react";

const ProjectBanner: React.FC = () => {
  const { banners, loading, getAllBanners } = useBanners();

  useEffect(() => {
    getAllBanners('projects');
  }, []);

  const data = useMemo(() => {
    if (banners && banners.length > 0) {
      const banner = banners[0];
      return {
        title: banner.title_1,
        subtitle: banner.subtitle,
        image_url: banner.image?.url,
      };
    }
    return null;
  }, [banners]);

  const bgImage = data?.image_url || "/images/home/futuristic_about.png";
  const title = data?.title || "Impactful Technology Integration";
  const subtitle = data?.subtitle || "Our portfolio showcases the successful deployment of AI, Quantum solutions, and autonomous systems that empower businesses globally.";

  if (loading) return <div className="w-full h-[600px] bg-gray-200 animate-pulse" />;

  return (
    <section className="relative w-full h-[600px] sm:h-[645px]">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Our Projects Banner"
        className="object-cover absolute w-full h-full inset-0"
      />

      {/* Gradient Overlay - Violet Tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#1a0b2e]/60 to-[#2e1065]/20 z-10" />

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="mx-auto container px-[16px] sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:px-[240px] pb-[96px] sm:pb-[96px]">
          <div className="text-white container mx-auto">
            {/* Breadcrumb */}
            <div className="flex justify-end px-2 sm:px-2 md:px-1 mb-[20px]">
              <Breadcrumb paths={[{ name: 'Home', href: '/' }, { name: 'Projects' }]} />
            </div>

            {/* Heading */}
            <h1 className="text-[32px] sm:text-[32px] md:text-[48px] lg:text-[56px] font-semibold pb-[8px]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-[14px] sm:text-[14px] md:text-[18px] lg:text-[20px] leading-snug md:leading-normal text-white/90">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectBanner;