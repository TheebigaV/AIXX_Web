'use client';

import React from 'react';
import Image from 'next/image';
import Breadcrumb from './Breadcrumb';

import useBanners from "@/hooks/public/useBanners";
import { useSettings } from "@/hooks/useSettings";
import { useEffect, useMemo } from "react";

const AboutUsBanner: React.FC = () => {
  const { banners, loading, getAllBanners } = useBanners();

  useEffect(() => {
    getAllBanners('about');
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

  const { getSetting } = useSettings();

  const bgImage = data?.image_url || "/images/aboutus/about_banner.png";
  const title = getSetting('about_banner_title') || data?.title || "Engineering the Future of AI & Quantum Integration";
  const subtitle = getSetting('about_banner_subtitle') || data?.subtitle || "AIXX unites next-generation intelligence, quantum computing, and autonomous systems to build resilient operations for a shared future.";

  if (loading) return <div className="w-full h-[500px] bg-gray-200 animate-pulse" />;

  return (
    <section className="relative w-full h-[500px] sm:h-[570px] md:h-[636px] lg:h-[645px] overflow-hidden">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="About Us Banner"
        className="object-cover absolute w-full h-full inset-0"
      />

      {/* Gradient Overlay - Teal Tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#00245a]/60 to-[#004d4d]/20 z-10" />

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="mx-auto container px-[16px] sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] pb-[64px] sm:pb-[64px] md:pb-[60px] lg:pb-[64px] xl:pb-[94.5px] 2xl:pb-[95.5px]">
          <div className="text-white ">
            
            {/* Breadcrumb aligned to right */}
            <div className="flex justify-end text-[14px] sm:text-[14px]">
              <Breadcrumb paths={[{ name: 'Home', href: '/' }, { name: 'About Us' }]} />
            </div>

            {/* Heading */}
            <h1 className="text-[24px] sm:text-[32px] md:text-[48px] lg:text-[56px] xl:text-[56px] font-bold leading-tight sm:leading-tight md:leading-snug">
              {title}
            </h1>

            {/* Subtitle */}
            <p className=" text-[14px] sm:text-[14px] md:text-[18px] lg:text-[20px] leading-relaxed text-white/90">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsBanner;
