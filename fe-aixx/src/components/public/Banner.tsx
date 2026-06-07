'use client';

import React from 'react';
import Image from 'next/image';
import Breadcrumb from './Breadcrumb';

interface BannerProps {
  altText: string;
  paths?: { name: string; href?: string }[];
  title?: string;
  subtitle?: string;
  bgImage?: string;
  overlay?: boolean; // true = show dark gradient overlay, false = no overlay
}

const Banner: React.FC<BannerProps> = ({
  altText,
  paths = [{ name: 'Home', href: '/' }, { name: 'Services' }],
  title = "Next-Generation Technology Solutions",
  subtitle = "Harnessing AI, Quantum computing, and Autonomous systems to redefine what's possible.",
  bgImage = "/images/service/services_banner.png",
  overlay = true,
}) => {
  return (
    <section
      className="relative w-screen max-w-[100vw] left-[calc(-50vw+50%)] overflow-hidden h-[420px] sm:h-[520px] md:h-[560px] lg:h-[620px] xl:h-[620px] 2xl:h-[620px]"
    >
      {/* Background Image */}
      <Image
        src={bgImage}
        alt={altText}
        fill
        className="object-cover object-center"
        priority
        sizes="(max-width: 360px) 360px, (max-width: 600px) 600px, (max-width: 768px) 768px, (max-width: 1400px) 1400px, 1920px"
        onError={(e) => {
          console.error('Image failed to load', e);
        }}
      />

      {/* Gradient Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#00062A]/70 to-[#00062A]/50 z-10" />
      )}
      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="mx-auto container px-4 sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] pb-6 sm:pb-8 md:pb-12 lg:pb-16">
          <div className="text-white max-w-5xl space-y-4 sm:space-y-3">

            {/* Breadcrumb aligned right */}
            <div className="flex justify-end">
              <Breadcrumb paths={paths} />
            </div>

            {/* Heading */}
            {title && (
              <h1 className="text-[26px] sm:text-[32px] md:text-[48px] lg:text-[56px] xl:text-[56px] font-bold leading-tight sm:leading-tight md:leading-snug">
                {title}
              </h1>
            )}

            {/* Subtitle */}
            {subtitle && (
              <p className="text-[15px] sm:text-[14px] md:text-[18px] lg:text-[20px] leading-relaxed text-white/90">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
