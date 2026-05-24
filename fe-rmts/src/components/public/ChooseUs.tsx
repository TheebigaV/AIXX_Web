'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const values = [
  { id: '01', title: 'Quantum Security', image: '/images/aboutus/user_quantum_security.jpg', iconActive: '/images/aboutus/icon1.svg', iconInactive: '/images/aboutus/icon1.svg' },
  { id: '02', title: 'Intelligent Automation', image: '/images/aboutus/user_intelligent_automation.jpg', iconActive: '/images/aboutus/icon2.svg', iconInactive: '/images/aboutus/icon2.svg' },
  { id: '03', title: 'Precision Engineering', image: '/images/aboutus/user_precision_engineering.jpg', iconActive: '/images/aboutus/icon3.svg', iconInactive: '/images/aboutus/icon3.svg' },
  { id: '04', title: 'Data Sovereignty', image: '/images/aboutus/user_data_sovereignty.jpg', iconActive: '/images/aboutus/icon4.svg', iconInactive: '/images/aboutus/icon4.svg' },
  { id: '05', title: 'AI Evolution', image: '/images/aboutus/user_ai_evolution.jpg', iconActive: '/images/aboutus/icon5.svg', iconInactive: '/images/aboutus/icon5.svg' },
  { id: '06', title: 'Global Connectivity', image: '/images/aboutus/user_global_connectivity.jpg', iconActive: '/images/aboutus/icon6.svg', iconInactive: '/images/aboutus/icon6.svg' },
];

const ChooseUs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  // Auto-change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % values.length);
      if (swiperRef.current) {
        swiperRef.current.slideTo((activeIndex + 1) % values.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index); // Slide to clicked card
    }
  };

  return (
    <section className="flex flex-col gap-10 bg-[#F9F9F9]">
      <div className="mx-auto container px-4 sm:px-[16px] md:px-[24px] lg:px-[24px] xl:px-[60px] 2xl:px-[240px] py-12">
        {/* Desktop Layout */}
        <div className="hidden xlmid:flex xl:gap-[76px] 2xl:gap-[188px]">
          {/* Left Side */}
          <div className="flex-1 flex flex-col">
            <div>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] 2xl:text-[20px] font-normal text-brand-500 mb-[8px]">
                Why Choose Us
              </p>
              <h2 className="text-[16px] sm:text-[24px] md:text-[32px] font-semibold text-[#00245A] mb-[24px]">
                Our Promise Starts with These Values
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-[20px]">
              {values.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleClick(index)}
                    className={`relative group p-5 flex flex-col items-center justify-center text-center transition-all duration-300 bg-white cursor-pointer ${isActive
                      ? 'border-[#010629]'
                      : 'border-brand-200 hover:border-[#010629] hover:bg-[#ffffff]'
                      }`}
                    style={{ height: '195px', width: '100%' }}
                  >
                    {/* Badge */}
                    <div
                      className={`absolute top-0 left-0 text-[24px] font-bold flex items-center justify-center ${isActive
                        ? 'bg-[#010629] text-white'
                        : 'bg-brand-50 text-brand-500 group-hover:bg-[#010629] group-hover:text-white'
                        }`}
                      style={{ width: '52px', height: '52px' }}
                    >
                      {item.id}
                    </div>

                    {/* Icon */}
                    <div className="mb-3 w-[68px] h-[68px] relative">
                      <div
                        className="w-full h-full absolute top-0 left-0 transition-all duration-500 ease-in-out"
                        style={{
                          WebkitMaskImage: `url(${item.iconActive})`,
                          maskImage: `url(${item.iconActive})`,
                          backgroundColor: isActive ? '#58B347' : '#191E42',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskSize: 'contain',
                          transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    </div>


                    {/* Title */}
                    <p className={`text-[20px] font-normal transition-colors duration-500 ${isActive ? 'text-brand-600' : 'text-[#191E42]'}`}>
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src={values[activeIndex].image}
              alt={values[activeIndex].title}
              className="xl:w-[468px] 2xl:w-[532px] xl:h-[507px] 2xl:h-[510px] object-cover transition-all duration-500 beveled-image"
            />
          </div>

        </div>

        {/* Mobile & Tablet Layout */}
        <div className="xlmid:hidden flex flex-col gap-10">
          {/* Heading */}
          <div className="w-full lg:text-left">
            <p className="text-[20px] font-normal text-brand-500 mb-1">Why Choose Us</p>
            <h2 className="text-2xl md:text-[32px] font-semibold text-[#00245A]">
              Our Promise Starts with These Values
            </h2>
          </div>

          {/* Image */}
          <div className="w-full">
            <img
              src={values[activeIndex].image}
              alt={values[activeIndex].title}
              className="w-full sm:h-[332px] md:h-[360px] lg:h-[413px] object-cover transition-all duration-500 beveled-image"
            />
          </div>

          {/* Grid for ≥768px */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4">
            {values.map((item, index) => {
              const isActive = index === activeIndex; // use activeIndex instead of index === 0
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)} // allow click to change active card
                  className={`relative group p-5 flex flex-col items-center justify-center text-center transition-all duration-300 bg-white cursor-pointer ${isActive
                    ? 'border-[#010629]'
                    : 'border-brand-200 hover:border-[#010629] hover:bg-[#f7f9ff]'
                    }`}
                  style={{ height: '195px', width: '100%' }}
                >
                  {/* Badge */}
                  <div
                    className={`absolute top-0 left-0 text-[24px] font-bold flex items-center justify-center ${isActive
                      ? 'bg-[#010629] text-white'
                      : 'bg-brand-50 text-brand-500 group-hover:bg-[#010629] group-hover:text-white'
                      }`}
                    style={{ width: '52px', height: '52px' }}
                  >
                    {item.id}
                  </div>

                  {/* Icon */}
                  <div className="mb-3 w-[68px] h-[68px] relative">
                    <div
                      className="w-full h-full absolute top-0 left-0 transition-all duration-500 ease-in-out"
                      style={{
                        WebkitMaskImage: `url(${item.iconActive})`,
                        maskImage: `url(${item.iconActive})`,
                        backgroundColor: isActive ? '#58B347' : '#191E42',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                  </div>

                  {/* Title */}
                  <p
                    className={`text-[20px] font-normal transition-colors duration-500 ${isActive ? 'text-brand-600' : 'text-[#191E42]'}`}
                  >
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>


          <div className="block lg:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={16}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              pagination={{
                clickable: true,
                renderBullet: (index, className) =>
                  `<span class="${className} custom-bullet"></span>`,
              }}
              breakpoints={{
                360: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
              }}
              className="pb-6 h-[250px]"
            >
              {values.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <SwiperSlide key={item.id}>
                    <div
                      onClick={() => handleClick(index)}
                      className={`relative group p-5 flex flex-col items-center justify-center text-center transition-all duration-300 bg-white cursor-pointer ${isActive
                        ? 'border-[#010629]'
                        : 'border-brand-200 hover:border-[#010629] hover:bg-[#f7f9ff]'
                        }`}
                      style={{ height: '195px' }}
                    >
                      {/* Badge */}
                      <div
                        className={`absolute top-0 left-0 text-[24px] font-bold flex items-center justify-center ${isActive
                          ? 'bg-[#010629] text-white'
                          : 'bg-brand-50 text-brand-500 group-hover:bg-[#010629] group-hover:text-white'
                          }`}
                        style={{ width: '52px', height: '52px' }}
                      >
                        {item.id}
                      </div>
                      {/* Icon */}
                      <div className="mb-3 w-[68px] h-[68px] relative">
                        <div
                          className="w-full h-full absolute top-0 left-0 transition-all duration-500 ease-in-out"
                          style={{
                            WebkitMaskImage: `url(${item.iconActive})`,
                            maskImage: `url(${item.iconActive})`,
                            backgroundColor: isActive ? '#58B347' : '#191E42',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskSize: 'contain',
                            transform: isActive ? 'scale(1.1)' : 'scale(1)',
                          }}
                        />
                      </div>

                      {/* Title */}
                      <p
                        className={`text-[20px] font-normal transition-colors duration-500 ${isActive ? 'text-brand-600' : 'text-[#191E42]'}`}
                      >
                        {item.title}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChooseUs;
