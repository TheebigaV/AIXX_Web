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

  const bgImage = data?.image_url || "/images/aboutus/quantum_engineer.png";
  const title = getSetting('home_contact_title') || data?.title || "Ready to Launch Your AI Training Journey?";
  const subtitle = getSetting('home_contact_subtitle') || data?.subtitle || "Connect with AIXX for corporate AI training, certification tracks, executive workshops and developer bootcamps designed to build skills fast.";

  return (
    <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 lg:py-20 bg-white">
      <div className="flex flex-col xlmid:flex-row xlmid:items-end items-center gap-8">
        <div className="w-full xlmid:w-auto flex justify-center xlmid:justify-start xlmid:flex-shrink-0 order-1 xlmid:order-1">
          <div className="polygon-corner-bg2 relative w-full lg:w-[45%] h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[420px] flex-shrink-0">
            <img
              src={bgImage}
              alt="AIXX Contact"
              className="object-cover absolute w-full h-full inset-0"
            />
          </div>
        </div>

        <div className="w-full lg:flex-1 space-y-6 bg-[#FAFAFA] p-8 lg:p-12 rounded-[24px] shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {subtitle}
          </p>
          <div>
            <Link
              href="/contact"
              className="beveled-corner inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 transition-all duration-300 w-full md:inline-flex md:w-auto"
              aria-label="Contact AIXX"
            >
              <span>Contact AIXX</span>
              <FaBolt className="ml-2 text-white group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContactAixx;
