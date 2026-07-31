'use client';

import React, { useEffect, useMemo } from 'react';
import Breadcrumb from './Breadcrumb';
import useBanners from "@/hooks/public/useBanners";
import { useSettings } from "@/hooks/useSettings";

const LatestNewsBanner: React.FC = () => {
  const { banners, loading, getAllBanners } = useBanners();

  useEffect(() => {
    getAllBanners('latest_news');
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

  const bgImage = data?.image_url || "/images/training_banner.png";
  const title = getSetting('latest_news_banner_title') || data?.title || "Latest Technology News & Global Initiatives";
  const subtitle = getSetting('latest_news_banner_subtitle') || data?.subtitle || "Explore breaking AI announcements, official certification programs, and expert insights from AIXX Academy.";

  return (
    <section className="relative w-full h-[420px] sm:h-[500px] md:h-[560px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Latest News Banner"
        className="object-cover absolute w-full h-full inset-0"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#001D4A]/70 to-slate-950/40 z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40 z-10" />

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 pb-10 sm:pb-14 md:pb-16 lg:pb-20">
          <div className="text-white space-y-3">
            {/* Breadcrumb aligned to right */}
            <div className="flex justify-end text-[14px]">
              <Breadcrumb paths={[{ name: 'Home', href: '/' }, { name: 'Latest News' }]} />
            </div>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-400 border border-brand-500/30 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              AIXX Announcements & News
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/90 max-w-3xl font-medium drop-shadow-sm">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsBanner;

