'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { services, headerContent } from '@/components/public/data/servicesData';
import { FaBolt } from 'react-icons/fa';

const HomeResidential: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeServiceId, setActiveServiceId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'residential' | 'commercial' | 'specialty'>('residential');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 768);

  useEffect(() => {
    const urlCategory = searchParams?.get('category');
    const urlServiceId = window.location.hash.substring(1);

    if (urlCategory && ['residential', 'commercial', 'specialty'].includes(urlCategory)) {
      setActiveFilter(urlCategory as any);
    }

    if (urlServiceId) {
      setActiveServiceId(urlServiceId);
    } else {
      const storedService = sessionStorage.getItem('selectedService');
      if (storedService) {
        const { category, id } = JSON.parse(storedService);
        if (category) setActiveFilter(category);
        if (id) setActiveServiceId(id);
      }
    }

    // Track window width changes
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchParams]);

  const currentServices = services[activeFilter];
  const activeService = currentServices.find(service => service.id === activeServiceId) || currentServices[0];

  useEffect(() => {
    if (currentServices.length > 0 && !currentServices.some(service => service.id === activeServiceId)) {
      setActiveServiceId(currentServices[0].id);
      setCurrentSlide(0);
    }
  }, [activeFilter, currentServices, activeServiceId]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setActiveServiceId(currentServices[index].id);
  };

  const getCardDimensions = () => {
    if (typeof window === 'undefined') {
      // Return mobile-safe defaults for SSR
      return { width: 350, height: 447, imageHeight: 256, imagePadding: 8, buttonPadding: 2, isMobile: true };
    }

    const w = window.innerWidth;

    // FIXED: Proper container width calculation based on your actual CSS classes
    let containerWidth = w;

    // Match the container padding from your CSS classes
    if (w >= 1920) {
      containerWidth = 1438; // max-w-[1438px] with 2xl:ml-[180px] 2xl:mr-auto
    } else if (w >= 1280) {
      // xl:pl-[60px] xl:pr-[40px] = 100px total horizontal padding
      containerWidth = w - 100;
    } else if (w >= 1024) {
      // min-[1024px]:pl-[32px] min-[1024px]:pr-[8px] = 40px total horizontal padding
      containerWidth = w - 40;
    } else if (w >= 768) {
      // min-[768px]:pl-[32px] min-[768px]:pr-[8px] = 40px total horizontal padding
      containerWidth = w - 40;
    } else if (w >= 600) {
      // sm:pl-[12px] sm:pr-[12px] = 24px total horizontal padding
      containerWidth = w - 24;
    } else {
      // px-2 = 16px total horizontal padding (8px + 8px)
      containerWidth = w - 16;
    }

    const horizontalGap = 20;
    let columns = 1;
    let cardWidth = containerWidth;

    // 1280px and above: 3 columns
    if (w >= 1280) {
      columns = 3;
      // Scale down from 1920px to 1280px smoothly - KEEP CARD SIZE, NOT GAP
      const scaleFactor = Math.min(1, (w - 1280) / (1920 - 1280));
      const baseWidth = 380; // width at 1280px
      const maxWidth = 466;  // width at 1920px
      cardWidth = Math.floor(baseWidth + (maxWidth - baseWidth) * scaleFactor);

      return {
        width: Math.min(cardWidth, maxWidth),
        height: 447,
        imageHeight: 256,
        imagePadding: 14,
        cardWidth: cardWidth
      };
    }

    // 600px to 1279px: 2 columns
    if (w >= 600) {
      columns = 2;

      // Ensure proper minimum and maximum sizes
      const minWidth = 280;
      const maxWidth = 500;

      // Scale card width for better appearance
      if (w >= 1024) {
        // 1024px to 1279px
        cardWidth = Math.min(Math.max(containerWidth / 2.2, minWidth), maxWidth);
      } else if (w >= 768) {
        // 768px to 1023px
        cardWidth = Math.min(Math.max(containerWidth / 2.2, minWidth), 450);
      } else {
        // 600px to 767px
        cardWidth = Math.min(Math.max(containerWidth / 2.2, minWidth), 400);
      }

      return {
        width: cardWidth,
        height: 447,
        imageHeight: 256,
        imagePadding: w >= 768 ? 12 : 10,
        compactPadding: w < 768
      };
    }

    // Below 600px: carousel (single column)
    return {
      width: containerWidth,
      height: 447,
      imageHeight: 256,
      imagePadding: 8,
      buttonPadding: 2,
      isMobile: true
    };
  };

  // Get popup dimensions based on screen size
  const getPopupDimensions = () => {
    if (typeof window === 'undefined') {
      return { width: '328px', height: '636px', isVertical: true };
    }

    const w = window.innerWidth;

    if (w < 600) {
      // Below 600px: 328px x 636px (vertical layout)
      return { width: '328px', height: '636px', isVertical: true };
    } else if (w >= 600 && w < 768) {
      // 600px - 767px: vertical layout
      return { width: '480px', height: '632px', isVertical: true };
    } else if (w >= 768 && w < 1024) {
      // 768px - 1023px: 560px x 628px (vertical layout)
      return { width: '560px', height: '628px', isVertical: true };
    } else if (w >= 1024 && w < 1280) {
      // 1024px - 1279px: horizontal layout
      return { width: '720px', height: '540px', isVertical: false };
    } else {
      // 1280px and above: original size (878px x 472px) (horizontal layout)
      return { width: '878px', height: '472px', isVertical: false };
    }
  };

  const [dims, setDims] = useState(getCardDimensions());
  const [popupDims, setPopupDims] = useState(getPopupDimensions());

  useEffect(() => {
    // Set dimensions immediately on mount to fix SSR mismatch
    setDims(getCardDimensions());
    setPopupDims(getPopupDimensions());

    const handleResize = () => {
      setDims(getCardDimensions());
      setPopupDims(getPopupDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full container mx-auto px-2 sm:pl-[12px] sm:pr-[12px] min-[768px]:pl-[32px] min-[768px]:pr-[8px] min-[1024px]:pl-[32px] min-[1024px]:pr-[8px] xl:pl-[60px] xl:pr-[40px] py-[72px] min-[768px]:py-[40px] min-[1024px]:py-[72px] bg-white">
      <div className="max-w-[1438px] mx-auto min-[768px]:ml-auto min-[768px]:mr-[30px] min-[768px]:max-w-[700px] min-[1024px]:mx-auto min-[1024px]:max-w-[1438px] 2xl:ml-[180px] 2xl:mr-auto 2xl:px-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-col lg:flex-col xl:flex-row justify-between items-center mb-12 gap-6 md:items-start md:gap-4">
          <div className="w-full min-[768px]:w-full lg:w-2/3 space-y-4 order-2 md:order-2 max-[798px]:order-1 min-[798px]:order-1 2xl:order-1 md:w-full md:text-left">
           <h1
  className="font-bold text-[#191E42]"
  style={{ fontSize: windowWidth <= 360 ? '24px' : '32px' }}
>
  {headerContent[activeFilter].title}
</h1>

<p
  className="text-gray-600 leading-relaxed"
  style={{ fontSize: windowWidth <= 360 ? '12px' : '16px' }}
>
  {headerContent[activeFilter].description}
</p>

          </div>

          <div className="w-full min-[768px]:w-full lg:w-auto order-1 md:order-1 max-[798px]:order-0 min-[798px]:order-2 2xl:order-2">
            {/* Desktop buttons */}
            <div className="hidden min-[600px]:flex flex-col min-[600px]:flex-row gap-3 justify-start min-[768px]:w-full min-[768px]:justify-stretch lg:justify-end lg:w-auto md:flex-col md:w-full md:justify-start">
              <button
                onClick={() => {
                  setActiveFilter('residential');
                  setCurrentSlide(0);
                }}
                className={`px-4 py-2.5 sm:px-6 sm:py-3 min-[768px]:flex-1 min-[768px]:text-center lg:flex-none font-medium transition-all duration-200 text-sm sm:text-base ${activeFilter === 'residential'
                  ? 'text-brand-500 border-b-2 border-brand-500'
                  : 'text-gray-800 border-b-2 border-transparent hover:text-gray-600'
                  }`}
              >
                Core Technology Ecosystems
              </button>
              <button
                onClick={() => {
                  setActiveFilter('commercial');
                  setCurrentSlide(0);
                }}
                className={`px-4 py-2.5 sm:px-6 sm:py-3 min-[768px]:flex-1 min-[768px]:text-center lg:flex-none font-medium transition-all duration-200 text-sm sm:text-base ${activeFilter === 'commercial'
                  ? 'text-brand-500 border-b-2 border-brand-500'
                  : 'text-gray-800 border-b-2 border-transparent hover:text-gray-600'
                  }`}
              >
                Enterprise Solutions
              </button>
              <button
                onClick={() => {
                  setActiveFilter('specialty');
                  setCurrentSlide(0);
                }}
                className={`px-4 py-2.5 sm:px-6 sm:py-3 min-[768px]:flex-1 min-[768px]:text-center lg:flex-none font-medium transition-all duration-200 text-sm sm:text-base ${activeFilter === 'specialty'
                  ? 'text-brand-500 border-b-2 border-brand-500'
                  : 'text-gray-800 border-b-2 border-transparent hover:text-gray-600'
                  }`}
              >
                Advanced Specialty Integration
              </button>
            </div>

            {/* Mobile dropdown */}
            <div className="min-[600px]:hidden relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center px-4 py-2.5 border border-gray-300 bg-[#00245A] text-white"
              >
                {activeFilter === 'residential'
                  ? 'Core Technology Ecosystems'
                  : activeFilter === 'commercial'
                    ? 'Enterprise Solutions'
                    : 'Advanced Specialty Integration'}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg">
                  <button
                    onClick={() => {
                      setActiveFilter('residential');
                      setIsDropdownOpen(false);
                      setCurrentSlide(0);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === 'residential' ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Core Technology Ecosystems
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter('commercial');
                      setIsDropdownOpen(false);
                      setCurrentSlide(0);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === 'commercial' ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Enterprise Solutions
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter('specialty');
                      setIsDropdownOpen(false);
                      setCurrentSlide(0);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === 'specialty' ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Advanced Specialty Integration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="relative">
          {/* Desktop Grid - 3 columns at 1280px+, 2 columns below */}
          <div className="hidden min-[600px]:grid grid-cols-1 min-[600px]:grid-cols-2 min-[1280px]:grid-cols-3 w-full"
            style={{
              gap: window.innerWidth >= 1280 ? '36px 12px' : '36px 20px'
            }}
          >
            {currentServices.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setActiveServiceId(service.id);
                  setIsExpanded(true);
                }}
                className="cursor-pointer group flex justify-center"
              >
                <div
                  className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                  style={{
                    width: '100%',
                    maxWidth: dims.width,
                    height: dims.height
                  }}
                >
                  {/* Image Section */}
                  <div
                    className="relative overflow-hidden flex-shrink-0"
                    style={{
                      height: dims.imageHeight,
                      margin: dims.imagePadding,
                      marginBottom: dims.imagePadding
                    }}
                  >
                    <Image
                      src={service.image || '/images/service/default.svg'}
                      alt={service.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col" style={{ padding: dims.imagePadding, paddingTop: dims.imagePadding }}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-shrink-0">
                        <Image
                          src={service.icon}
                          alt={`${service.title} icon`}
                          width={28}
                          height={28}
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight flex-1">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 flex-grow leading-relaxed mb-2">
                      {service.description}
                    </p>

                    {/* Read More Button - Inside Content */}
                    <div className="flex justify-end mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/services?category=${activeFilter}#${service.id}`);
                          setActiveServiceId(service.id);
                          setIsExpanded(true);
                        }}
                        className="text-brand-500 font-semibold flex items-center gap-2 hover:text-brand-600 transition-colors text-xs md:text-sm"
                      >
                        Read more
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel - Below 600px */}
          <div className="min-[600px]:hidden relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${currentServices.length * 100}%`
              }}
            >
              {currentServices.map((service, index) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-full px-4"
                  style={{ width: `${100 / currentServices.length}%` }}
                  onClick={() => {
                    setActiveServiceId(service.id);
                    setIsExpanded(true);
                  }}
                >
                  <div
                    className="bg-white border border-gray-200 overflow-hidden cursor-pointer flex flex-col mx-auto"
                    style={{
                      width: '100%',
                      maxWidth: dims.width,
                      height: dims.height
                    }}
                  >
                    <div
                      className="relative overflow-hidden flex-shrink-0"
                      style={{
                        height: dims.imageHeight,
                        margin: dims.imagePadding,
                        marginBottom: dims.imagePadding
                      }}
                    >
                      <Image
                        src={service.image || '/images/service/default.svg'}
                        alt={service.title}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="flex-1 flex flex-col" style={{ padding: dims.imagePadding, paddingTop: 0 }}>
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-shrink-0">
                          <Image
                            src={service.icon}
                            alt={`${service.title} icon`}
                            width={windowWidth <= 360 ? 40 : 20}
                            height={windowWidth <= 360 ? 40 : 20}
                            className={windowWidth <= 360 ? "w-10 h-10" : "w-5 h-5"}
                          />
                        </div>
                        <h3
                          className="font-bold text-gray-900 flex-1"
                          style={{ fontSize: windowWidth <= 360 ? '18px' : '14px' }}
                        >
                          {service.title}
                        </h3>                  </div>
                      <p
                        className="text-gray-600 line-clamp-3 flex-grow leading-relaxed"
                        style={{ fontSize: windowWidth <= 360 ? '14px' : '12px' }}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div style={{
                      padding: dims.imagePadding,
                      paddingTop: dims.compactPadding ? 6 : (dims.buttonPadding ? 4 : dims.imagePadding / 2)
                    }} className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/services?category=${activeFilter}#${service.id}`);
                          setActiveServiceId(service.id);
                          setIsExpanded(true);
                        }}
                        className="text-brand-500 font-semibold flex items-center gap-1 text-xs"
                      >
                        Read more
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Dots */}
            {currentServices.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {[
                  currentSlide > 0 ? currentSlide - 1 : currentServices.length - 1,
                  currentSlide,
                  currentSlide < currentServices.length - 1 ? currentSlide + 1 : 0
                ].map((index, pos) => (
                  <button
                    key={pos}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 ${pos === 1
                      ? 'bg-[#00245A] w-6 h-3'
                      : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Mobile Navigation Arrows */}
            {currentServices.length > 1 && (
              <>
              </>
            )}
          </div>

          {/* Enhanced Popup View with Responsive Sizes */}
          {isExpanded && activeService && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              {/* Outer popup card - Responsive sizes */}
              <div
                className="bg-white shadow-2xl relative"
                style={{
                  width: popupDims.width,
                  height: popupDims.height,
                  maxWidth: '90vw',
                  maxHeight: '90vh'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-3 right-3 z-10 bg-[#191E42] p-2 shadow-md hover:bg-[#2a3455] transition-colors"
                  aria-label="Close panel"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>

                {/* Inner content box with spacing */}
                <div className="w-full h-full p-3 sm:p-4 lg:p-5">
                  <div
                    className="w-full h-full bg-gray-50 flex overflow-hidden"
                    style={{
                      minHeight: '100%',
                      flexDirection: popupDims.isVertical ? 'column' : 'row'
                    }}
                  >

                    {/* Image Section - Top on mobile/tablet, left on desktop */}
                    <div
                      className="flex-shrink-0 relative"
                      style={{
                        width: popupDims.isVertical ? '100%' : '50%',
                        height: popupDims.isVertical ? (windowWidth >= 768 ? '280px' : '200px') : '100%',
                        minHeight: popupDims.isVertical ? (windowWidth >= 768 ? '280px' : '200px') : 'auto'
                      }}
                    >
                      <Image
                        src={activeService.image || '/images/service/default.svg'}
                        alt={activeService.title}
                        layout="fill"
                        objectFit="cover"
                        className="brightness-90"
                      />
                    </div>

                    {/* Content Section - Bottom on mobile/tablet, right on desktop */}
                    <div
                      className="p-3 sm:p-4 lg:p-6 flex flex-col overflow-y-auto bg-white flex-grow"
                      style={{
                        width: popupDims.isVertical ? '100%' : '50%'
                      }}
                    >
                      <div>
                        {/* Icon and Title */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                              <Image
                                src={activeService.icon}
                                alt={`${activeService.title} icon`}
                                width={windowWidth < 600 ? 24 : 32}
                                height={windowWidth < 600 ? 24 : 32}
                                className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10"
                              />
                            </div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-[#191E42] font-bold">{activeService.title}</h3>
                          </div>
                        </div>

                        {/* Italic Description */}
                        <p className="italic text-brand-600 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">"{activeService.description}"</p>

                        {/* Detailed Description */}
                        <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
                          {activeService.content || activeService.description}
                        </p>

                        {/* Features List */}
                        {activeService.features && (
                          <div className="mb-3 sm:mb-4 lg:mb-6">
                            <h3 className="text-sm sm:text-base lg:text-lg text-gray-900 mb-2 font-semibold">What We Do in {activeService.title}</h3>
                            <ul className="list-none space-y-1 sm:space-y-1.5">
                              {activeService.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-gray-700 text-xs sm:text-sm">
                                  <span className="mt-0.5 sm:mt-1 mr-2 text-black">
                                    <svg className="w-2.5 sm:w-3 lg:w-4 h-2.5 sm:h-3 lg:h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <circle cx="8" cy="8" r="6" />
                                    </svg>
                                  </span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Contact Button */}
                      <div className="pt-2 sm:pt-3 lg:pt-4 mt-auto">
                        <button
                          onClick={() => {
                            router.push('/contact');
                            setIsExpanded(false);
                          }}
                          className="beveled-corner w-full bg-brand-600 text-white py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base lg:text-lg font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
                          Contact Us <FaBolt className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeResidential;