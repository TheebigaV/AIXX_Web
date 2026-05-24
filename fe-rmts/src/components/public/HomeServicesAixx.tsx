'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaBrain, FaAtom, FaShieldAlt, FaShoppingCart, FaCar, FaPlane,
  FaChartLine, FaTruck, FaChevronLeft, FaChevronRight,
  FaGraduationCap, FaNewspaper, FaRocket
} from 'react-icons/fa';
import useCategories from '@/hooks/public/useCategories';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const icons = [
  FaBrain, FaAtom, FaShieldAlt, FaShoppingCart,
  FaCar, FaPlane, FaChartLine, FaTruck,
  FaRocket, FaChartLine, FaBrain, FaGraduationCap, FaNewspaper
];

interface HomeServicesProps {
  isHomePage?: boolean;
}

const HomeServicesAixx: React.FC<HomeServicesProps> = ({ isHomePage = true }) => {
  const { categories, loading, getAllCategories } = useCategories();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getAllCategories();
    // Trigger entrance animation after mount
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* ─── HOME CAROUSEL CARD ─── */
  const renderHomeCard = (sector: any, index: number) => {
    const Icon = icons[index % icons.length];
    return (
      <div className="h-full flex flex-col group rounded-[24px] border border-slate-200 bg-white shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-300 relative overflow-hidden w-full p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="relative z-10 flex-grow flex flex-col">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-brand-600 shadow-sm mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 border border-slate-100 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-8 w-8 transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h3 className="text-xl font-bold text-[#111827] mb-4 line-clamp-2 group-hover:text-brand-600 transition-colors duration-300">{sector.name}</h3>
          <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line flex-grow mb-8">{sector.description}</p>
          <div className="mt-auto pt-4 border-t border-slate-100 transition-colors">
            <Link href={`/services#${sector.slug}`} className="inline-flex items-center text-brand-600 font-semibold text-sm hover:text-brand-700 transition-colors group/link">
              Explore Services
              <svg className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  /* ─── SERVICES PAGE CIRCLE ITEM ─── */
  const renderServiceCircle = (sector: any, index: number) => {
    const Icon = icons[index % icons.length];
    const delay = index * 80; // stagger ms

    return (
      <div
        key={sector.id}
        className="flex flex-col items-center text-center group cursor-pointer"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        }}
      >
        {/* Outer ring + circle */}
        <div className="relative mb-5">
          {/* Pulsing ring on hover */}
          <div className="absolute inset-0 rounded-full bg-brand-600/15 scale-0 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

          {/* Main circle */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white border-2 border-brand-200 shadow-lg flex items-center justify-center
                          group-hover:bg-brand-600 group-hover:border-brand-600 group-hover:shadow-xl
                          transition-all duration-500 relative z-10">
            <Icon className="h-14 w-14 sm:h-16 sm:w-16 text-brand-600 group-hover:text-white transition-colors duration-500" />
          </div>
        </div>

        {/* Service Name */}
        <p className="text-sm sm:text-base font-semibold text-[#191E42] leading-snug max-w-[160px] group-hover:text-brand-600 transition-colors duration-300">
          {sector.name}
        </p>

        {/* Animated underline */}
        <span className="mt-2 block h-0.5 w-0 bg-brand-500 rounded-full group-hover:w-14 transition-all duration-500" />
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-24 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute top-0 right-0 w-full h-full bg-tech-grid opacity-5 pointer-events-none" />

      {/* Decorative blobs for services page */}
      {!isHomePage && (
        <>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand-50/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#191E42]/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[120px] relative z-10">

        {/* ── HOME PAGE HEADER ── */}
        {isHomePage && (
          <div className="max-w-4xl mx-auto text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3 text-brand-600">
              <FaAtom className="animate-[spin_4s_linear_infinite]" />
              <p className="text-base sm:text-lg font-semibold uppercase tracking-wider m-0">Advanced Tech Sectors</p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#191E42] leading-tight">
              AIXX: A Futuristic Technology Ecosystem
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#4B5563] max-w-3xl mx-auto">
              We act as a technology integrator, combining AI, Quantum, and modern infrastructure into real-world solutions across critical high-tech industries.
            </p>
          </div>
        )}

        {/* ── SERVICES PAGE HEADER ── */}
        {!isHomePage && (
          <div className="max-w-3xl mx-auto text-center mb-20 relative z-10 mt-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#191E42] leading-tight mb-6 tracking-tight">
              Everything We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-[#191E42]">
                Offer
              </span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Explore our full spectrum of AI and Quantum-powered sectors — from deep tech to professional training and knowledge.
            </p>
          </div>
        )}

        {/* ── LOADING ── */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-brand-600 animate-pulse flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              Loading Sectors...
            </div>
          </div>
        ) : (
          <div className="relative">

            {/* ── HOME: SWIPER CAROUSEL ── */}
            {isHomePage ? (
              <div className="relative px-0 sm:px-12">
                <Swiper
                  modules={[Pagination, Autoplay, Navigation]}
                  spaceBetween={24}
                  slidesPerView={1}
                  navigation={{
                    prevEl: '.swiper-button-prev-custom',
                    nextEl: '.swiper-button-next-custom',
                  }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                  }}
                  className="!pb-20 !pt-4"
                >
                  {categories.filter((c: any) => c.slug !== 'seminars-workshops-courses-skill-training-certification' && c.slug !== 'news-letters').map((sector: any, index: number) => (
                    <SwiperSlide key={sector.id} className="h-auto">
                      {renderHomeCard(sector, index)}
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button className="swiper-button-prev-custom absolute top-[calc(50%-2.5rem)] left-0 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-brand-600 hover:bg-brand-50 hover:scale-110 transition-all cursor-pointer">
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <button className="swiper-button-next-custom absolute top-[calc(50%-2.5rem)] right-0 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-brand-600 hover:bg-brand-50 hover:scale-110 transition-all cursor-pointer">
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>

            ) : (
              /* ── SERVICES PAGE: CIRCLES GRID ── */
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 sm:gap-x-12 sm:gap-y-16 max-w-5xl mx-auto">
                {categories.filter((c: any) => c.slug !== 'seminars-workshops-courses-skill-training-certification' && c.slug !== 'news-letters').map((sector: any, index: number) =>
                  renderServiceCircle(sector, index)
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeServicesAixx;
