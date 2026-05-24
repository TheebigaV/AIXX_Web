'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiImage, FiArrowUpRight } from 'react-icons/fi';
import Link from 'next/link';
import { Product } from './data/productTypes';

interface ProductListProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

const getResponsiveLayout = (itemsPerPage: number) => {
  // For 12 items per page (common for first page)
  if (itemsPerPage === 12) {
    return {
      gridColumns: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4',
      imageHeight: {
        mobile: 180,
        sm: 200,
        md: 220,
        lg: 240,
        xl: 260,
      },
      imageWidth: 180,
    };
  }

  // Default responsive layout
  return {
    gridColumns: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    imageHeight: {
      mobile: 160,
      sm: 180,
      md: 200,
      lg: 220,
      xl: 240,
    },
    imageWidth: 160,
  };
};

export default function ProductList({
  products,
  itemsPerPage,
}: ProductListProps) {
  const [gridCols, setGridCols] = useState('grid-cols-2 sm:grid-cols-3 lg:grid-cols-4');

  useEffect(() => {
    const updateGridCols = () => {
      const width = window.innerWidth;

      if (itemsPerPage === 15 && width >= 1920) {
        setGridCols('product-grid-5-cols');
      } else if (itemsPerPage === 15) {
        setGridCols('product-grid-5-cols');
      } else if (itemsPerPage === 12) {
        setGridCols('product-grid-custom');
      } else {
        setGridCols('product-grid-custom');
      }
    };

    updateGridCols();
    window.addEventListener('resize', updateGridCols);
    return () => window.removeEventListener('resize', updateGridCols);
  }, [itemsPerPage]);

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <FiImage size={96} className="mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are currently no products in this category.
        </p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .product-grid-5-cols {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        
        @media (min-width: 768px) {
          .product-grid-5-cols {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .product-grid-5-cols {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1920px) {
          .product-grid-5-cols {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 1.25rem;
          }
        }

        .product-grid-custom {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        
        @media (min-width: 768px) {
          .product-grid-custom {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .product-grid-custom {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (min-width: 1920px) {
          .product-grid-custom {
            gap: 1.25rem;
          }
          
          .grid {
            padding-left: 0;
            padding-right: 0;
            margin-left: -3rem;
            margin-right: -3rem;
          }
        }
      `}</style>

      <div className={`grid ${gridCols} gap-4 md:gap-6 2xl:gap-5`}>
        {products.map((product) => (
          <div key={product.id} className="group block hover:opacity-90 transition-opacity">
            <Link href={`/product-detail/${product.slug}`} className="block">
              {/* Outer container with dynamic height */}
              <div className="relative w-full overflow-hidden h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[260px] 2xl:h-[340px]">

                {/* Image background with increased height */}
                <div
                  className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden h-full"
                  style={{
                    backgroundColor: '#f5f5f5',
                    clipPath: 'polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 0 100%)'
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    {product.main_product_image.url ? (
                      <Image
                        src={product.main_product_image.url}
                        alt={product.name}
                        fill
                        className="object-cover w-full h-full"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 0 100%)'
                        }}
                      />

                    ) : (
                      <div className="text-[#2f3472] text-center p-4">
                        <FiImage size={48} className="mx-auto mb-2" />
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="absolute top-0 right-0 w-[60px] h-[60px] bg-brand-600 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                    transform: 'translate(1px, -1px)'
                  }}
                >
                  <FiArrowUpRight
                    className="absolute top-2 right-2 text-white"
                    size={20}
                  />
                </div>
              </div>

              <div className="px-3 py-3 rounded-2xl transition-shadow duration-300 bg-white group max-w-sm">
                <p className="text-lg font-semibold text-[#2f3472] line-clamp-1 group-hover:text-brand-600 transition-colors duration-300">
                  {product.name.replace(/<[^>]+>/g, '')}
                </p>

                <p className="text-sm text-[#4b4f8f] line-clamp-2 group-hover:text-brand-600 transition-colors duration-300">
                  {product.description.replace(/<[^>]+>/g, '')}
                </p>
              </div>

            </Link>
          </div>
        ))}
      </div>
    </>
  );
}