'use client';

import React from 'react';
import Image from 'next/image';
import Breadcrumb from './Breadcrumb';

interface BannerProps {
  altText: string;
  paths?: { name: string; href?: string }[];
  title?: string;
  subtitle?: string;
  height?: {
    xl?: string;
    lg?: string;
    md?: string;
    sm?: string;
    xs?: string;
  };
}

const Banner: React.FC<BannerProps> = ({
  altText,
  paths = [{ name: 'Home', href: '/' }, { name: 'Services' }],
  title = "Next-Generation Technology Solutions",
  subtitle = "Harnessing AI, Quantum computing, and Autonomous systems to redefine what's possible.",
  height = {
    xl: '600px',
    lg: '500px',
    md: '450px',
    sm: '400px',
    xs: '350px',
  },
}) => {
  return (
    <section
      className="relative w-full"
      style={{
        height: height.xl,
        maxHeight: height.xl,
      }}
    >
      {/* Background Image */}
            <Image
        src="/images/service/services_banner.png"
        alt={altText}
        fill
        className="object-cover object-center"
        priority
        sizes="(max-width: 360px) 360px, (max-width: 600px) 600px, (max-width: 768px) 768px, (max-width: 1400px) 1400px, 1920px"
        onError={(e) => {
          console.error('Image failed to load', e);
        }}
      />

      {/* Gradient Overlay - Electric Blue Tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#001f4d]/60 to-[#003366]/20 z-10" />

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="mx-auto container px-4 sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] pb-6 sm:pb-8 md:pb-12 lg:pb-16">
          <div className="text-white max-w-5xl space-y-4 sm:space-y-3">

            {/* Breadcrumb aligned right */}
            <div className="flex justify-end">
              <Breadcrumb paths={paths} />
            </div>

            {/* Heading */}
            <h1 className="text-[26px] sm:text-[32px] md:text-[48px] lg:text-[56px] xl:text-[56px] font-bold leading-tight sm:leading-tight md:leading-snug">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] sm:text-[14px] md:text-[18px] lg:text-[20px] leading-relaxed text-white/90">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
