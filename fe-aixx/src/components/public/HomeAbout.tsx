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
  const title = getSetting('home_about_title') || data?.title || "A Futuristic AI & Quantum Technology Integrator";
  const subtitle = getSetting('home_about_subtitle') || data?.subtitle || "AIXX is a forward‑looking technology integrator, uniting AI, Quantum computing, and cutting‑edge innovation to deliver real‑world solutions across diverse high‑tech sectors.\n\nFuture training programs in AI and Quantum technologies will empower the next generation of innovators.";

  return (
    <section className="w-full bg-[#FAFAFA] -mt-8 pt-8 sm:pt-8 md:pt-8 lg:pt-8 lgmid:pt-14 xlmid:pt-8 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
      <div className="container mx-auto px-[16px] sm:px-[16px] md:px-[24px] lg:px-[24px] xlmid:px-[60px] xl:px-[60px] 2xl:px-[240px] flex flex-col xlmid:flex-row items-center gap-0 sm:gap-2 xlmid:gap-[110px] xl:gap-[90px] lg:gap-[70px] md:gap-[50px]">
        {/* Left Image Container - Adjusted alignment */}
        <div className="relative w-full xlmid:w-[55%] xl:w-1/2 2xl:w-1/2 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] xlmid:h-[500px] xl:h-[550px] 2xl:h-[550px] mt-4 sm:mt-6 xlmid:mt-8 mb-0">
          <img
            src={bgImage}
            alt="AI & Quantum Technology Integration"
            className="object-contain absolute w-full h-full inset-0"
          />
        </div>

        {/* Right Content */}
        <div className="w-full xlmid:w-[45%] xl:w-1/2 2xl:w-1/2 flex flex-col justify-center space-y-6 py-6 md:py-8 lg:py-10">
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
              className="inline-block bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors duration-300 text-center w-full xlmid:w-auto px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 text-sm sm:text-base"
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