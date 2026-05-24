'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { services } from '@/components/public/data/servicesData';

const HomeServices = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'residential' | 'commercial' | 'specialty'>('residential');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [carouselSlide, setCarouselSlide] = useState(0);

  const allServices = services[activeCategory];
  const slides = [];
  for (let i = 0; i < allServices.length; i += 2) {
    slides.push(allServices.slice(i, i + 2));
  }

  const mobileSlides = allServices;

  // Create carousel slides - 2 items for 600px-767px, 1 item for below 600px
  const getCarouselSlides = (itemsPerSlide: number) => {
    const carouselSlides = [];
    for (let i = 0; i < allServices.length; i += itemsPerSlide) {
      carouselSlides.push(allServices.slice(i, i + itemsPerSlide));
    }
    return carouselSlides;
  };

  const handleCategoryChange = (category: 'residential' | 'commercial' | 'specialty') => {
    setActiveCategory(category);
    setActiveSlide(0);
    setIsDropdownOpen(false);
    setCarouselSlide(0);
  };

  const handleServiceNavigation = (serviceId: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedService', JSON.stringify({
        category: activeCategory,
        id: serviceId
      }));
    }
    router.push(`/services?category=${activeCategory}#${serviceId}`);
  };

  const nextCarouselSlide = (totalSlides: number) => {
    setCarouselSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevCarouselSlide = (totalSlides: number) => {
    setCarouselSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <>
      <style jsx global>{`
        @media (min-width: 360px) and (max-width: 399px) {
          .home-services-section { margin-top: -90px; }
          .services-content-360 { margin-top: 60px; }
        }
      `}</style>

      <section className="home-services-section w-full pt-24 pb-32 bg-[#ffffff] xl:-mt-20 md:-mt-16 2xl:-mt-32">
        <div className="container mx-auto px-[16px] sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] flex flex-col min-[1280px]:flex-row gap-10 ">
          
          {/* Below 1280px: Single column layout */}
          <div className="w-full min-[1280px]:w-1/2 flex flex-col">
            {/* Title */}
            <h2 className="text-base sm:text-lg lg:text-xl font-normal text-brand-600 mb-2 lg:mb-3">
              Services
            </h2>
            
            {/* Subtitle */}
            <p className="text-2xl mb-6 text-[#191E42] font-semibold">
              Quality-Driven Services That Keep You Powered,<br className="hidden min-[1920px]:block" /> Protected, and Connected
            </p>

            {/* Image for below 1280px */}
            <div className="block min-[1280px]:hidden mb-6 services-content-360">
              <div 
                className="beveled-image relative w-full h-[280px] min-[480px]:h-[320px] min-[600px]:h-[360px] min-[768px]:h-[320px] min-[1024px]:h-[340px] rounded-none overflow-hidden shadow-lg"
              >
                <Image
                  src="/images/home/service.jpeg"
                  alt="Our Services"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,..."
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Category buttons for below 1280px */}
            <div className="min-[1280px]:hidden mb-6">
              {/* Regular buttons for 600px and above */}
              <div className="flex max-[599px]:hidden gap-2 min-[768px]:gap-3 flex-wrap">
                {['residential', 'commercial', 'specialty'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category as any)}
                    className={`flex-1 px-4 py-2.5 text-center font-medium transition-all duration-300 text-sm min-[1024px]:text-base
                      ${activeCategory === category
                        ? 'bg-[#191E42] text-white shadow-md'
                        : 'bg-[#F1F1F1] text-[#191E42] hover:bg-gray-200'
                      }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} Services
                  </button>
                ))}
              </div>
              
              {/* Dropdown style for below 600px */}
              <div className="hidden max-[599px]:block relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#191E42] text-white px-4 py-3.5 flex items-center justify-between font-semibold text-base"
                >
                  <span>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Services</span>
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-30 border-t-0">
                    {['residential', 'commercial', 'specialty'].filter(cat => cat !== activeCategory).map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category as any)}
                        className="w-full px-4 py-3.5 text-left font-medium text-base bg-white text-[#191E42] hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)} Services
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Carousel for below 600px (1 card per slide) */}
            <div className="block min-[600px]:hidden w-full">
              {(() => {
                const carouselSlides = getCarouselSlides(1);
                return (
                  <div className="relative">
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${carouselSlide * 100}%)` }}
                      >
                        {carouselSlides.map((slide, slideIndex) => (
                          <div key={slideIndex} className="w-full flex-shrink-0">
                            {slide.map((service) => {
                              const isHovered = hoveredIndex === service.id;
                              return (
                                <div
                                  key={service.id}
                                  className="relative group"
                                  onMouseEnter={() => setHoveredIndex(service.id)}
                                  onMouseLeave={() => setHoveredIndex(null)}
                                >
                                  <div className={`transition-all duration-300 ease-in-out overflow-hidden relative bg-[#FAFAFA] border border-gray-100 flex flex-col p-3 w-full ${isHovered ? 'shadow-md min-h-[200px] z-10' : 'h-[92px]'}`}>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center p-2">
                                        <Image
                                          src={service.icon}
                                          alt={service.title}
                                          width={44}
                                          height={44}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-[16px] font-medium text-[#191E42] whitespace-nowrap overflow-hidden text-ellipsis">
                                          {service.title}
                                        </h3>
                                      </div>
                                    </div>
                                    <div className={`transition-all duration-300 flex-grow flex flex-col ${isHovered ? 'opacity-100 mt-3' : 'opacity-0 h-0'}`}>
                                      {isHovered && (
                                        <>
                                          <div className="flex-grow">
                                            <p className="text-xs text-black line-clamp-3">
                                              {service.description}
                                            </p>
                                          </div>
                                          <div className="mt-auto text-right">
                                            <button
                                              onClick={() => handleServiceNavigation(service.id)}
                                              className="inline-block text-brand-600 text-xs font-medium hover:underline transition-colors duration-200 px-2 py-1 hover:bg-brand-50 rounded"
                                            >
                                              Read More →
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {carouselSlides.length > 1 && (
                      <>
                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-4">
                          {(() => {
                            const totalSlides = carouselSlides.length;
                            let indicesToShow = [];
                            
                            if (totalSlides <= 3) {
                              indicesToShow = Array.from({ length: totalSlides }, (_, i) => i);
                            } else {
                              if (carouselSlide === 0) {
                                indicesToShow = [0, 1, 2];
                              } else if (carouselSlide === totalSlides - 1) {
                                indicesToShow = [totalSlides - 3, totalSlides - 2, totalSlides - 1];
                              } else {
                                indicesToShow = [carouselSlide - 1, carouselSlide, carouselSlide + 1];
                              }
                            }
                            
                            return indicesToShow.map((slideIndex) => (
                              <button
                                key={slideIndex}
                                onClick={() => setCarouselSlide(slideIndex)}
                                className={`h-2 transition-all ${
                                  slideIndex === carouselSlide ? 'w-8 bg-[#00245A]' : 'w-2 bg-gray-300'
                                }`}
                                aria-label={`Go to slide ${slideIndex + 1}`}
                              />
                            ));
                          })()}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Carousel for 600px-767px (2 cards per slide) */}
            <div className="hidden min-[600px]:block min-[768px]:hidden w-full">
              {(() => {
                const carouselSlides = getCarouselSlides(2);
                return (
                  <div className="relative">
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${carouselSlide * 100}%)` }}
                      >
                        {carouselSlides.map((slide, slideIndex) => (
                          <div key={slideIndex} className="w-full flex-shrink-0">
                            <div className="grid grid-cols-2 gap-4">
                              {slide.map((service) => {
                                const isHovered = hoveredIndex === service.id;
                                return (
                                  <div
                                    key={service.id}
                                    className="relative group"
                                    onMouseEnter={() => setHoveredIndex(service.id)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden relative bg-[#FAFAFA] border border-gray-100 flex flex-col p-3 w-full ${isHovered ? 'shadow-md min-h-[180px] z-10' : 'h-[80px]'}`}>
                                      <div className="flex items-center space-x-2">
                                        <div className="flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center p-2">
                                          <Image
                                            src={service.icon}
                                            alt={service.title}
                                            width={44}
                                            height={44}
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h3 className="text-[16px] font-medium text-[#191E42] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {service.title}
                                          </h3>
                                        </div>
                                      </div>
                                      <div className={`transition-all duration-300 flex-grow flex flex-col ${isHovered ? 'opacity-100 mt-3' : 'opacity-0 h-0'}`}>
                                        {isHovered && (
                                          <>
                                            <div className="flex-grow">
                                              <p className="text-xs text-black line-clamp-3">
                                                {service.description}
                                              </p>
                                            </div>
                                            <div className="mt-auto text-right">
                                              <button
                                                onClick={() => handleServiceNavigation(service.id)}
                                                className="inline-block text-brand-600 text-xs font-medium hover:underline transition-colors duration-200 px-2 py-1 hover:bg-brand-50 rounded"
                                              >
                                                Read More →
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {carouselSlides.length > 1 && (
                      <>
                        {/* Dots indicator */}
                        <div className="flex justify-center gap-2 mt-4">
                          {carouselSlides.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCarouselSlide(index)}
                              className={`h-2 transition-all ${
                                carouselSlide === index ? 'w-8 bg-[#00245A]' : 'w-2 bg-gray-300'
                              }`}
                              aria-label={`Go to slide ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Service cards (2 column layout for 768px to 1920px) */}
            <div className="hidden min-[768px]:flex gap-4 w-full">
              <div className="flex-1 flex flex-col gap-4">
                {services[activeCategory].filter((_, index) => index % 2 === 0).map((service) => {
                  const isHovered = hoveredIndex === service.id;
                  return (
                    <div
                      key={service.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredIndex(service.id)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden relative bg-[#FAFAFA] border border-gray-100 flex flex-col p-3 min-[768px]:p-4 w-full ${isHovered ? 'shadow-md min-h-[180px] z-10' : 'h-[85px]'}`}>
                        <div className="flex items-center space-x-2 min-[1024px]:space-x-3">
                          <div className="flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center p-2">
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={44}
                              height={44}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[16px] font-medium text-[#191E42] whitespace-nowrap overflow-hidden text-ellipsis">
                              {service.title}
                            </h3>
                          </div>
                        </div>
                        <div className={`transition-all duration-300 flex-grow flex flex-col ${isHovered ? 'opacity-100 mt-3' : 'opacity-0 h-0'}`}>
                          {isHovered && (
                            <>
                              <div className="flex-grow">
                                <p className="text-xs sm:text-sm text-black line-clamp-3">
                                  {service.description}
                                </p>
                              </div>
                              <div className="mt-auto text-right">
                                <button
                                  onClick={() => handleServiceNavigation(service.id)}
                                  className="inline-block text-brand-600 text-xs sm:text-sm font-medium hover:underline transition-colors duration-200 px-2 py-1 hover:bg-brand-50 rounded"
                                >
                                  Read More →
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {services[activeCategory].filter((_, index) => index % 2 === 1).map((service) => {
                  const isHovered = hoveredIndex === service.id;
                  return (
                    <div
                      key={service.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredIndex(service.id)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden relative bg-[#FAFAFA] border border-gray-100 flex flex-col p-3 min-[768px]:p-4 w-full ${isHovered ? 'shadow-md min-h-[180px] z-10' : 'h-[85px]'}`}>
                        <div className="flex items-center space-x-2 min-[1024px]:space-x-3">
                          <div className="flex-shrink-0 w-[44px] h-[44px] flex items-center justify-center p-2">
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={44}
                              height={44}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[16px] font-medium text-[#191E42] whitespace-nowrap overflow-hidden text-ellipsis">
                              {service.title}
                            </h3>
                          </div>
                        </div>
                        <div className={`transition-all duration-300 flex-grow flex flex-col ${isHovered ? 'opacity-100 mt-3' : 'opacity-0 h-0'}`}>
                          {isHovered && (
                            <>
                              <div className="flex-grow">
                                <p className="text-xs min-[1024px]:text-sm text-black line-clamp-3">
                                  {service.description}
                                </p>
                              </div>
                              <div className="mt-auto text-right">
                                <button
                                  onClick={() => handleServiceNavigation(service.id)}
                                  className="inline-block text-brand-600 text-xs min-[1024px]:text-sm font-medium hover:underline transition-colors duration-200 px-2 py-1 hover:bg-brand-50 rounded"
                                >
                                  Read More →
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right side - main image & category buttons (for 1280px and above only) */}
          <div className="hidden min-[1280px]:flex min-[1280px]:w-1/2 min-[768px]:flex-col min-[768px]:justify-center">
            <div 
              className="beveled-image relative w-full h-[380px] min-[1400px]:h-[400px] min-[1920px]:h-[431px] rounded-none overflow-hidden shadow-lg mb-6 min-[1280px]:mb-8"
            >
              <Image
                src="/images/home/service.jpeg"
                alt="Our Services"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,..."
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Category buttons below image */}
            <div className="flex gap-3 mt-4 flex-wrap min-[768px]:flex-nowrap">
              {['residential', 'commercial', 'specialty'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category as any)}
                  className={`flex-1 px-4 py-2.5 text-center font-medium transition-all duration-300 text-sm min-[1280px]:text-base
                    ${activeCategory === category
                      ? 'bg-[#191E42] text-white shadow-md'
                      : 'bg-[#F1F1F1] text-[#191E42] hover:bg-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} Services
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HomeServices;