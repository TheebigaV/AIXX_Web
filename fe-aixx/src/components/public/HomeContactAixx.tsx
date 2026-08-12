'use client';
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { FaBolt } from "react-icons/fa";
import Link from "next/link";
import useBanners from "@/hooks/public/useBanners";
import { useSettings } from "@/hooks/useSettings";

const HomeContactAixx = () => {
  const { banners, loading, getAllBanners } = useBanners();

  useEffect(() => {
    getAllBanners('home_contact');
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

  const bgImage = data?.image_url || "/images/home/home_contact_illustration.png";
  const title = getSetting('home_contact_title') || data?.title || "Ready to Launch Your AI Training Journey?";
  const subtitle = getSetting('home_contact_subtitle') || data?.subtitle || "Connect with AIXX for corporate AI training, certification tracks, executive workshops and developer bootcamps designed to build skills fast.";

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lgmid:px-16 xlmid:px-24 2xl:px-32 py-10 sm:py-16 lgmid:py-20 bg-white">
      <div className="flex flex-col lgmid:flex-row items-stretch gap-8 lgmid:gap-12 max-w-7xl mx-auto">
        {/* Left Side: Text Content */}
        <div className="w-full lgmid:w-1/2 space-y-6 bg-[#FAFAFA] p-6 sm:p-8 lgmid:p-12 rounded-[24px] shadow-sm order-2 lgmid:order-1 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl lgmid:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base lgmid:text-lg text-gray-600 leading-relaxed">
            {subtitle}
          </p>
          <div>
            <Link
              href="/contact"
              className="beveled-corner inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 transition-all duration-300 w-full sm:w-auto font-semibold"
              aria-label="Contact AIXX"
            >
              <span>Contact AIXX</span>
              <FaBolt className="ml-2 text-white group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Image Illustration */}
        <div className="w-full lgmid:w-1/2 flex items-center justify-center order-1 lgmid:order-2">
          <div className="polygon-corner-bg2 relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] xl:min-h-[440px] rounded-[24px] overflow-hidden border border-slate-100 shadow-md bg-slate-50 flex-shrink-0">
            <img
              src={bgImage}
              alt="AIXX Contact"
              className="object-cover absolute w-full h-full inset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContactAixx;
