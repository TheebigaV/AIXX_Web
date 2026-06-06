'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaGraduationCap, FaChalkboardTeacher, FaLaptopCode, FaCertificate, FaCheckCircle, FaNewspaper, FaImages, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { fetchPublicTrainings } from '@/lib/training';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const tabs = [
  { id: 'seminars', label: 'Seminars', icon: FaChalkboardTeacher },
  { id: 'workshops', label: 'Workshops', icon: FaLaptopCode },
  { id: 'courses', label: 'Courses', icon: FaGraduationCap },
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

const TrainingContent = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicTrainings()
      .then((res) => {
        setTrainings(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch trainings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = trainings.filter((item) => item.type === activeTab);

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

      const dynamicGallery = filteredItems.filter(item => item.image?.url).map(item => ({
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
        {filteredItems.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex items-start gap-4">
                {item.image?.url ? (
                  <img src={item.image.url} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                    <FaCheckCircle />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-[#191E42] mb-2">{item.name}</h4>
                  <p className="text-sm text-slate-600">{item.description}</p>
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
            Elevate Your Expertise
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Discover a comprehensive suite of learning pathways. Whether you are looking for a brief seminar or full professional certification, AIXX offers industry-leading education.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row gap-12 w-full mx-auto">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/3 flex flex-col gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 w-full p-5 rounded-2xl transition-all duration-300 text-left border ${
                    isActive 
                      ? 'bg-white border-brand-500 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-brand-600 transform scale-[1.02]' 
                      : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600 hover:text-[#191E42]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`font-bold text-lg ${isActive ? 'text-[#191E42]' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 min-h-[500px] h-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingContent;
