'use client';
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useBanners from "@/hooks/public/useBanners";
import { useSettings } from "@/hooks/useSettings";

const HomeAbout = () => {
  const { banners, loading, getAllBanners } = useBanners();

  useEffect(() => {
    getAllBanners('home_about');
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

  const bgImage = data?.image_url || "/images/home/futuristic_about.png";
  const title = getSetting('home_about_title') || data?.title || "AIXX Academy: AI training with real business outcomes";
  const subtitle = getSetting('home_about_subtitle') || data?.subtitle || "AIXX delivers corporate-ready AI training, workshops, and certification for executives, teams, and developers across Southeast Asia.\n\nBuild practical know-how in generative AI, prompt engineering, AI leadership, and agentic systems to accelerate your digital transformation.";

  return (
    <section className="w-full bg-[#FAFAFA] -mt-8 pt-12 lg:pt-20 pb-12 lg:pb-20">
      <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Left Image Container - Adjusted alignment */}
        <div className="relative w-full lg:w-1/2 h-[240px] sm:h-[300px] md:h-[380px] lg:h-[480px] xl:h-[540px] flex-shrink-0">
          <img
            src={bgImage}
            alt="AI & Quantum Technology Integration"
            className="object-contain absolute w-full h-full inset-0"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-5 py-6 lg:py-0">
          <p className="text-brand-600 font-medium text-base sm:text-lg mt-4 sm:mt-6 xlmid:mt-0">
            About AIXX
          </p>
          <h1 className="text-[#191E42] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            {title}
          </h1>

          <div className="space-y-4">
            {subtitle.split('\n').map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-[#2E2937] text-base sm:text-lg leading-relaxed ${index === 1 ? 'font-medium border-l-4 border-brand-500 pl-4' : ''}`}
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>


          {/* View More Button */}
          <div className="pt-2 sm:pt-3 md:pt-4 2xl:pt-10">
            <Link
              href="/about-us"
            className="inline-block bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors duration-300 text-center w-full lg:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base rounded-sm"
              style={{
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
              aria-label="Learn more about our company"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;