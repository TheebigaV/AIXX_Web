'use client';

import React from 'react';
import Image from 'next/image';
import { useSettings } from "@/hooks/useSettings";

const AboutContent: React.FC = () => {
  const { getSetting } = useSettings();
  return (
    <section className="w-full mx-auto container px-[16px] sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] py-[72px]">
      <div className="">
      <div className="flex flex-col lg:flex-row items-start xlmid:gap-[35px] xl:gap-[56px]">

        {/* Desktop Grid (only for ≥1400px) */}
        {/* Desktop Single Image */}
        <div className="hidden lg:block w-full lg:w-1/2 self-stretch">
          <div className="relative w-full h-full min-h-[500px]">
            <Image
              src="/images/aboutus/ai_chip.png"
              alt="The Intelligence Behind AIXX"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 space-y-[8px] text-gray-800 ">
                    <p className="text-brand-600 text-[14px] sm:text-[14px] md:text-[18px] 2xl:text-[20px] font-medium mb-[8px]">{getSetting('about_content_tagline', 'Architecting Tomorrow')}</p>
          <h2 className="text-[24px] sm:text-[24px] md:text-[32px] font-semibold text-[#00245A] leading-snug mb-[8px]">
            {getSetting('about_content_title', 'The Intelligence Behind AIXX')}
          </h2>
          <p className="text-[14px] sm:text-[14px] md:text-[16px] text-gray-500 leading-relaxed mb-[32px]">
            {getSetting('about_content_desc', 'AIXX partners with global enterprises to integrate AI, Quantum computing, cybersecurity, and autonomous systems, creating ecosystems that are safer, smarter, and infinitely more capable.')}
          </p>

          {/* Mobile + Tablet Grid (360px → 1399px) */}
          {/* Mobile Single Image */}
          <div className="block lg:hidden w-full my-6">
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                src="/images/aboutus/ai_chip.png"
                alt="The Intelligence Behind AIXX"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Mission Block */}
          <div className="relative bg-[#F9F9F9] p-5 overflow-hidden ">
            {/* Top-right Triangle */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-brand-500 border-l-transparent z-10" />

            <div className="flex items-center gap-4 relative z-20">
              <div className="w-[52px] h-[52px] shrink-0">
                <Image src="/images/aboutus/mission.svg" alt="Mission Icon" width={52} height={52} />
              </div>
              <h3 className="text-[20px] sm:text-[20px] font-semibold text-gray-800">{getSetting('about_mission_title', 'Mission')}</h3>
            </div>

            <p className="text-[14px] sm:text-[14px] lg:text-[16px] text-gray-600 pl-[5px] relative z-20 font-medium">
              {getSetting('about_mission_desc', 'To accelerate intelligent transformation through AI and advanced systems integration, helping organizations operate with confidence and clarity.')}
            </p>
          </div>

          {/* Vision Block */}
          <div className="relative bg-[#F9F9F9] p-5 overflow-hidden">
            {/* Top-right Triangle */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-brand-500 border-l-transparent z-10" />

            <div className="flex items-center gap-4 relative z-20">
              <div className="w-[52px] h-[52px] shrink-0">
                <Image src="/images/aboutus/vission.svg" alt="Vision Icon" width={52} height={52} />
              </div>
              <h3 className="text-[20px] sm:text-[20px] font-semibold text-gray-800">{getSetting('about_vision_title', 'Vision')}</h3>
            </div>

            <p className="text-[14px] sm:text-[14px] lg:text-[16px] text-gray-600 pl-[5px] relative z-20 font-medium">
              {getSetting('about_vision_desc', 'To shape the shared future by designing secure, scalable technology ecosystems that connect people, data, and decisions.')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default AboutContent;
