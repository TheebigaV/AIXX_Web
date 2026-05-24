'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Controller } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
const journeyCards = [
  { title: 'AI Research Phase', date: 'Launched' },
  { title: 'Quantum Infrastructure', date: 'Completed' },
  { title: 'Ecosystem Launch', date: 'Strategic Rollout' },
  { title: 'Future Outlook', date: 'Vision' },
];

const sliderImages = [
  '/images/aboutus/journey_ai_research.jpg',
  '/images/aboutus/journey_quantum_infra.jpg',
  '/images/aboutus/journey_ecosystem.jpg',
  '/images/aboutus/journey_future.jpg',
];

const Journey = () => {
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [cardSwiper, setCardSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Track active slide

  return (
    <div className="bg-white text-[#00062A] ">
      <div className="mx-auto container py-10 px-4 sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px]">
      {/* Heading Section */}
      <div className="mb-6">
        <p className="text-[20px] text-brand-500 font-normal">Our Journey So Far</p>
        <h2 className="text-2xl md:text-[32px] font-semibold mt-[8px] mb-[24px]">
          More Than a Company — A Commitment
        </h2>
      </div>

      {/* Image Slider Section */}
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden mb-8">
        <Swiper
          modules={[Pagination, Autoplay, Controller]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          onSwiper={setMainSwiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          controller={{ control: cardSwiper }}
          className="w-full h-full"
        >
          {sliderImages.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={imgSrc}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay Text */}
                <div className="absolute bottom-[100px] left-0 right-0 text-white z-10 bg-[#FFFFFF]/20 p-[10px]">
                  <p className="text-[28px] font-bold">The People Who Power AIXX</p>
                  <p className="text-[28px] font-bold">The Team Behind the Shared Future</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Cards Section for 360px–1023px (Synced Slider) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#00245A]">
          <Swiper
            modules={[Pagination, Controller]}
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-bullet"></span>`,
            }}
            loop
            onSwiper={setCardSwiper}
            controller={{ control: mainSwiper }}
            slidesPerView={1}
            className="py-4"
          >
            {journeyCards.map((card, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`px-4 py-6 h-full shadow-md rounded-md cursor-pointer ${
                    activeIndex === index ? 'bg-[#191E42]' : 'bg-[#00245A]'
                  } text-white`}
                  onClick={() => mainSwiper?.slideToLoop(index)}
                >
                  <h3 className="text-base md:text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{card.date}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Cards Section for >=1024px (Grid) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#00245A] hidden xlmid:grid grid-cols-4">
          {journeyCards.map((card, index) => (
            <div
              key={index}
              onClick={() => mainSwiper?.slideToLoop(index)}
              className={`px-4 py-6 border-l border-[#ffffff33] last:border-none cursor-pointer transition-colors duration-300 ${
                activeIndex === index ? 'bg-[#191E42]' : 'bg-[#00245A]'
              } text-white hover:bg-[#191E42]`}
            >
              <h3 className="text-base lg:text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{card.date}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Journey;
