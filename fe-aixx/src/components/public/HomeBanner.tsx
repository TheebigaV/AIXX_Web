'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBolt } from 'react-icons/fa';
import { fetchAllBanners } from '@/lib/public/banners';
import useBanners from "@/hooks/public/useBanners"
import { useSettings } from "@/hooks/useSettings";

type PublicBanner = {
  id: number;
  title1: string | null;
  title2: string | null;
  subtitle: string | null;
  image: string | null;      // storage path
  image_url: string | null;  // absolute URL (Storage::url)
};

const HomeBanner: React.FC = () => {
  // const [data, setData] = useState<PublicBanner | null>(null);
  // const [loading, setLoading] = useState(true);

  // Destructure needed values from the custom hook. The hook returns a richer object; we only need these fields.
  const { banners, loading, pagination, getAllBanners } = useBanners();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await fetchAllBanners();
  //       setData(res.data?.data ?? null);
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    getAllBanners('home');
  }, []);

  const data = useMemo(() => {
    if (banners && banners.length > 0) {
      const banner = banners[0]; // show first active banner
      return {
        id: banner.id,
        title1: banner.title_1 ?? null,
        title2: banner.title_2 ?? null,
        subtitle: banner.subtitle ?? null,
        image_url: banner.image?.url ?? null,
      };
    }
    return null;
  }, [banners]);

  // const data = useMemo(() => (banners && banners.length > 0 ? banners[0] : null), [banners]);

  const { getSetting } = useSettings();

  const headingLine1 = getSetting('home_banner_title') || data?.title1 || 'AIXX: Futuristic AI & Quantum Integrator';
  const headingLine2 = data?.title2 || 'Driving Innovation Across Leading Tech Sectors';
  const subtitle = getSetting('home_banner_subtitle') || data?.subtitle || 'We combine AI, Quantum tech, and modern solutions to empower businesses across global high‑tech industries.';

  // Safely handle image URL - only use if it's a valid string
  const bgImage = data?.image_url && typeof data.image_url === 'string' && data.image_url.trim() !== ''
    ? data.image_url
        : '/images/home/home_banner_v3.png';

  if (loading) {
    return (
      <section className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[645px] xl:h-[645px] 2xl:h-[645px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[645px] xl:h-[645px] 2xl:h-[645px]">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="AIXX Future Banner"
        className="object-cover absolute w-full h-full inset-0"
        style={{ objectPosition: 'center top' }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/home/home_banner.svg';
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00062A] via-[#00062A]/60 to-[#00062A]/20 z-10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="mx-auto container px-4 sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] pb-6 sm:pb-8 md:pb-12 lg:pb-16">
          <div className="text-white max-w-5xl space-y-4 sm:space-y-3">
            <h1 className="text-[26px] sm:text-[32px] md:text-[48px] lg:text-[56px] xl:text-[56px] font-bold leading-tight sm:leading-tight md:leading-snug text-white">
              {headingLine1} <br />
              <span className="text-white">Over</span> <span className="text-brand-500">{headingLine2}</span>
            </h1>

            <p className="text-[15px] sm:text-[14px] md:text-[18px] lg:text-[20px] leading-relaxed text-white/90">
              {subtitle}
            </p>

            <Link
              href="/contact"
              className="beveled-corner inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 transition-all duration-300 w-full md:inline-flex md:w-auto"
              aria-label="Contact Us"
            >
              <span>Start the Future</span>
              <FaBolt className="text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;