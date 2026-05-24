'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from 'react-icons/fi';
import useCategories from '@/hooks/public/useCategories';
import { CategoryType } from '@/types/category';

const HomeProducts = () => {
  const { categories, loading, error, loadCategories } = useCategories();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1920);
  const [cardsPerView, setCardsPerView] = useState(2);
  const [cardWidth, setCardWidth] = useState(384);
  const [gap, setGap] = useState(24);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setWindowWidth(typeof window !== 'undefined' ? window.innerWidth : 1920);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth >= 1400) {
      setCardsPerView(2);
      setCardWidth(384);
      setGap(24);
    } else if (windowWidth >= 1024) {
      setCardsPerView(2);
      setCardWidth(320);
      setGap(24);
    } else if (windowWidth >= 768) {
      setCardsPerView(1.5);
      const availableWidth = windowWidth - 32;
      const totalGap = 16;
      const calculatedCardWidth = (availableWidth - totalGap) / 1.5;
      setCardWidth(Math.floor(calculatedCardWidth));
      setGap(16);
    } else {
      setCardsPerView(1);
      setCardWidth(Math.min(320, windowWidth - 32));
      setGap(24);
    }
  }, [windowWidth]);

  const totalSlides = Math.ceil((categories?.length || 0) / Math.floor(cardsPerView)) - 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (loading) {
    return (
      <div className="w-full text-center py-50">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p>No categories found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff]">
      <div className='container mx-auto px-2 sm:px-4 lg:px-8 xl:px-[80px] md:-mt-12 2xl:px-[240px] py-[72px]'>
        <div className="mb-10 mt-0 lg:mt-[-20px]">
          <h2 className="text-base sm:text-lg lg:text-xl font-normal text-brand-600 mb-2 lg:mb-3">
            Products
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-[#00245A] text-lg sm:text-xl lg:text-2xl font-medium">
              Product Category
            </p>
            {categories.length > Math.floor(cardsPerView) && (
              <div className="flex space-x-3">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={`p-2 ${
                    currentSlide === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-brand-50 text-brand-600'
                  }`}
                  aria-label="Previous slide"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentSlide >= totalSlides}
                  className={`p-2 ${
                    currentSlide >= totalSlides
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-brand-50 text-brand-600'
                  }`}
                  aria-label="Next slide"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden relative pt-[160px] md:pt-[30px] lg:pt-[10px] sm:pt-[20px]">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentSlide * (cardWidth + gap) * Math.floor(cardsPerView)
              }px)`,
              width: 'max-content',
              gap: `${gap}px`,
            }}
          >
            {categories.map((item: CategoryType, index: number) => (
              <div
                key={index}
                style={{ width: `${cardWidth}px`, flexShrink: 0 }}
              >
                <Link href={`/product/${item.slug}`} className="block h-full">
                  <div className="relative border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden h-full">
                    {/* Triangle corner */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-[#00245A] z-20">
                      <div className="absolute top-[-50px] right-[10px] text-white">
                        <FiArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Full-height image background */}
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={item.image?.url || '/images/home/home_category.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        priority={index < 2}
                        sizes={`(max-width: 768px) ${cardWidth}px, (max-width: 1024px) ${cardWidth}px, ${cardWidth}px`}
                      />
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>

                    {/* Spacer to maintain card height */}
                    <div className="relative h-64 sm:h-72 w-full"></div>

                    {/* Text box overlay - positioned to overlap bottom of image */}
                    <div className="relative -mt-12 mx-4 mb-4 bg-white p-4 z-10 shadow-md">
                      <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-1 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.products_count || 0}{' '}
                        {(item.products_count || 0) === 1
                          ? 'Product'
                          : 'Products'}{' '}
                        Available
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;