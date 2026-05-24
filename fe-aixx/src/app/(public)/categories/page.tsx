'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUpRight, FiImage } from 'react-icons/fi';
import useCategories from '@/hooks/public/useCategories';
import { CategoryType } from '@/types/category';

const CategoriesPage = () => {
  const { categories, loading, error, loadCategories } = useCategories();
  const [windowWidth, setWindowWidth] = useState(1920);
  const [cardsPerRow, setCardsPerRow] = useState(4);
  const [cardWidth, setCardWidth] = useState(300);
  const [gap, setGap] = useState(24);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setWindowWidth(typeof window !== 'undefined' ? window.innerWidth : 1920);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Responsive layout based on window width
    if (windowWidth >= 1536) {
      setCardsPerRow(4);
      setCardWidth(320);
      setGap(24);
    } else if (windowWidth >= 1280) {
      setCardsPerRow(3);
      setCardWidth(300);
      setGap(20);
    } else if (windowWidth >= 768) {
      setCardsPerRow(2);
      setCardWidth(280);
      setGap(16);
    } else {
      setCardsPerRow(1);
      setCardWidth(windowWidth - 32);
      setGap(16);
    }
  }, [windowWidth]);

  if (loading) {
    return (
      <div className="w-full text-center py-70">
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
    <div className="bg-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-[240px]">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#00245A] mb-8">
          Product Categories
        </h1>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${cardWidth}px, 1fr))`,
          }}
        >
          {categories.map((item: CategoryType, index: number) => (
            <Link key={index} href={`/product/${item.slug}`} className="block">
              <div className="relative border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden h-72 sm:h-80 md:h-96 lg:h-[400px]">
                {/* Triangle corner */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-[#00245A] z-20">
                  <div className="absolute top-[-50px] right-[10px] text-white">
                    <FiArrowUpRight size={18} />
                  </div>
                </div>

                {/* Full card image */}
                <div className="absolute inset-0 w-full h-full">
                  {item.image?.url ? (
                    <Image
                      src={item.image.url}
                      alt={item.name}
                      fill
                      className="object-cover w-full h-full"
                      sizes={`(max-width: 768px) ${cardWidth}px, (max-width: 1280px) ${cardWidth}px, ${cardWidth}px`}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <FiImage size={48} className="text-gray-400" />
                    </div>
                  )}
                  {/* Optional gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                {/* Bottom text box overlapping the image */}
                <div className="absolute bottom-0 left-0 right-0 mx-4 mb-4 bg-white/80 p-4 z-10 shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {item.products_count || 0}{' '}
                    {(item.products_count || 0) === 1 ? 'Product' : 'Products'} Available
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
