'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaChalkboardTeacher, FaLaptopCode, FaCertificate, FaCheckCircle, FaNewspaper, FaImages, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const tabs = [
  { id: 'seminars', label: 'Seminars', icon: FaChalkboardTeacher },
  { id: 'workshops', label: 'Workshops', icon: FaLaptopCode },
  { id: 'certification', label: 'Skill Training & Certification', icon: FaCertificate },
  { id: 'newsletters', label: 'Latest Technology News', icon: FaNewspaper },
  { id: 'media_gallery', label: 'Training Media Gallery', icon: FaImages },
];

interface TrainingItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  image?: {
    url: string;
  } | null;
}

interface TrainingContentProps {
  defaultTab?: string;
  hideTabs?: boolean;
}

const TrainingContent = ({ defaultTab = tabs[0].id, hideTabs = false }: TrainingContentProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    setLoading(true);

    // For media gallery and newsletters we fetch all and filter client-side,
    // otherwise request the server with a `type` param so the API returns only relevant items.
    const fetchPromise = activeTab === 'media_gallery' || activeTab === 'newsletters'
      ? fetchPublicTrainings()
      : fetchPublicTrainings(activeTab);

    fetchPromise
      .then((res) => {
        const payload = res.data.data || res.data;
        // Ensure we always work with an array
        const items = Array.isArray(payload) ? payload : [];

        // If server returned all trainings (no type filter), filter here for tabs that have types
        if (activeTab === 'media_gallery') {
          setTrainings(items.filter(item => item.image?.url));
        } else if (activeTab === 'newsletters') {
          setTrainings(items.filter(item => item.type === 'newsletters' || item.type === 'newsletter'));
        } else {
          setTrainings(items);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch trainings:', err);
        setTrainings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      );
    }

    const currentTab = tabs.find(t => t.id === activeTab);
    
    if (activeTab === 'media_gallery') {
      const defaultGallery = [
        { src: '/images/gallery/classroom.png', alt: 'Classroom Settings', title: 'Classroom Settings' },
        { src: '/images/gallery/certificate.png', alt: 'AIXX Certificate', title: 'Certificate from AIXX PTE LTD' },
        { src: '/images/gallery/award.png', alt: 'Award Presentation', title: 'Award Presentation Ceremony' },
      ];

      const dynamicGallery = trainings.filter(item => item.image?.url).map(item => ({
        src: item.image!.url,
        alt: item.name,
        title: item.name
      }));

      const galleryImages = [...dynamicGallery, ...defaultGallery];

      return (
        <div className="animate-fade-in-up">
          <h3 className="text-3xl font-bold text-[#191E42] mb-6">{currentTab?.label}</h3>
          <div className="mb-8 relative px-2 sm:px-12 group">
            <button className="swiper-custom-prev absolute top-1/2 left-0 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#191E42] hover:bg-brand-500 hover:text-white transition-all cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <FaChevronLeft size={16} className="ml-[-2px]" />
            </button>
            
            <button className="swiper-custom-next absolute top-1/2 right-0 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#191E42] hover:bg-brand-500 hover:text-white transition-all cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <FaChevronRight size={16} className="ml-[2px]" />
            </button>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 2 }
              }}
              navigation={{
                prevEl: '.swiper-custom-prev',
                nextEl: '.swiper-custom-next',
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="w-full pb-16 pt-2"
              style={{ '--swiper-pagination-bottom': '0px', paddingBottom: '3rem' } as React.CSSProperties}
            >
              {galleryImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group relative rounded-2xl overflow-hidden shadow-lg h-72 border border-brand-100 cursor-pointer">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#191E42]/90 via-[#191E42]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h4 className="font-bold text-white text-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h4>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      );
    }
    
    return (
      <div className="animate-fade-in-up">
        <h3 className="text-3xl font-bold text-[#191E42] mb-6">{currentTab?.label}</h3>
        {trainings.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {trainings.map((item) => (
              <div key={item.id} className="bg-brand-50 p-5 rounded-2xl border border-brand-100 flex flex-col sm:flex-row items-start gap-4">
                {item.image?.url ? (
                  <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                    <FaCheckCircle />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-[#191E42] mb-1.5">{item.name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No {currentTab?.label.toLowerCase()} currently available. Check back soon!</p>
        )}
      </div>
    );
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />
      <div className="w-full container mx-auto px-[16px] sm:px-[16px] md:px-[24px] lg:px-[28px] xl:px-[75px] 2xl:px-[240px] relative z-10">
        
        {/* Header Area */}
        <div className="text-center w-full mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#191E42] mb-6 tracking-tight">
            Strategic AI Training Designed for Business Outcomes
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Explore AIXX’s learning journeys for executives, technical teams, and corporate innovators — from fast workshops to full certification tracks.
          </p>
        </div>

        {/* Navigation Tabs - horizontal on top */}
        <div className="flex flex-col w-full mx-auto gap-6">
          {/* Horizontal tab bar */}
          {!hideTabs && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-600 border border-brand-500 shadow-md'
                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Content Area */}
          <div className="bg-white rounded-3xl p-4 sm:p-8 md:p-12 shadow-xl border border-slate-100 min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingContent;
