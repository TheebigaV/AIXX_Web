'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUpRight, FiImage } from 'react-icons/fi';
import useProducts from '@/hooks/public/useProducts';

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  main_product_image?: { url: string };
  url: string;
}

interface RenderRelatedProductsProps {
  baseSlug: string;
  categoryId: number;
  currentProductId?: number; // The currently viewed product ID to exclude
  visibleProductsCount?: number;
  layoutConfig?: any;
}

// Enhanced Carousel Component with ProductList styling
const ProductsCarousel: React.FC<{ products: RelatedProduct[]; perSlide: number }> = ({ 
  products, 
  perSlide 
}) => {
  const slides: RelatedProduct[][] = [];
  for (let i = 0; i < products.length; i += perSlide) {
    slides.push(products.slice(i, i + perSlide));
  }
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (slides.length <= 1) return; // Don't auto-play if only one slide
    
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (products.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .product-carousel-grid {
          display: grid;
          gap: 1rem;
        }
        
        @media (min-width: 640px) {
          .product-carousel-grid {
            gap: 1.5rem;
          }
        }
        
        @media (min-width: 1920px) {
          .product-carousel-grid {
            gap: 1.25rem;
          }
        }
      `}</style>

      <div className="overflow-hidden relative">
        {/* Slides */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div 
              key={slideIndex} 
              className="w-full flex-shrink-0 product-carousel-grid"
              style={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${perSlide}, minmax(0, 1fr))`
              }}
            >
              {slide.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id}
                  className="group block hover:opacity-90 transition-opacity"
                >
                  <Link href={`/product-detail/${relatedProduct.slug}`} className="block">
                    {/* Image container with responsive heights matching ProductList */}
                    <div className="relative w-full overflow-hidden h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[260px] 2xl:h-[340px]">
                      {/* Image background with clipped corner */}
                      <div
                        className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden h-full"
                        style={{
                          backgroundColor: '#f5f5f5',
                          clipPath: 'polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 0 100%)'
                        }}
                      >
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                          {relatedProduct.main_product_image?.url ? (
                            <Image
                              src={relatedProduct.main_product_image.url}
                              alt={relatedProduct.name}
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

                      {/* Hover arrow indicator */}
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

                    {/* Product info */}
                    <div className="px-3 py-3 rounded-2xl transition-shadow duration-300 bg-white group max-w-sm">
                      <p className="text-lg font-semibold text-[#2f3472] line-clamp-1 group-hover:text-brand-600 transition-colors duration-300">
                        {relatedProduct.name.replace(/<[^>]+>/g, '')}
                      </p>

                      <p className="text-sm text-[#4b4f8f] line-clamp-2 group-hover:text-brand-600 transition-colors duration-300">
                        {relatedProduct.description.replace(/<[^>]+>/g, '')}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Navigation dots - only show if more than one slide */}
        {slides.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 transition-all duration-300 ${
                  activeSlide === index ? 'bg-[#191E42] w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default function RenderRelatedProducts({
  baseSlug,
  categoryId,
  currentProductId, // The product being viewed
  visibleProductsCount: propVisibleProductsCount,
  layoutConfig: propLayoutConfig,
}: RenderRelatedProductsProps) {
  const {
    products: relatedProducts,
    loading,
    loadProducts,
  } = useProducts();

  const [visibleProductsCount, setVisibleProductsCount] = useState(propVisibleProductsCount || 4);
  const [filteredProducts, setFilteredProducts] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      
      // Match ProductList breakpoints
      if (width >= 1920) {
        setVisibleProductsCount(5); // 5 columns on 2xl+
      } else if (width >= 1024) {
        setVisibleProductsCount(4); // 4 columns on lg+
      } else if (width >= 640) {
        setVisibleProductsCount(3); // 3 columns on sm+
      } else {
        setVisibleProductsCount(2); // 2 columns on mobile
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load products when categoryId changes
  useEffect(() => {
    if (categoryId) {
      // Extract category slug from baseSlug (format: /product/category-slug)
      const categorySlug = baseSlug.replace('/product/', '');
      
      // Load products with category filter
      loadProducts(1, 10, categorySlug, '');
    }
  }, [categoryId, baseSlug, loadProducts]);

  // Filter products to EXCLUDE the current product being viewed
  useEffect(() => {
    if (relatedProducts && relatedProducts.length > 0) {
      const filtered = relatedProducts.filter(product => {
        // EXCLUDE the current product that's being viewed
        if (currentProductId && product.id === currentProductId) {
          console.log(`Excluding current product: ${product.name} (ID: ${product.id})`);
          return false;
        }
        
        return true;
      });
      
      console.log(`Total products: ${relatedProducts.length}, After filtering: ${filtered.length}`);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [relatedProducts, currentProductId]);

  if (loading) {
    return (
      <div className="mt-16 pt-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  // Don't render if no products after filtering
  if (!filteredProducts || filteredProducts.length === 0) {
    console.log('No related products to display after filtering');
    return null;
  }

  return (
    <div className="mt-16 pt-8 px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[#00245A]">
          Explore More Products
        </h2>
        <Link
          href={baseSlug}
          className="beveled-corner text-white px-6 py-2 transition-colors font-medium"
          prefetch={false}
        >
          View More
        </Link>
      </div>
      
      <ProductsCarousel 
        products={filteredProducts} 
        perSlide={visibleProductsCount}
      />
    </div>
  );
}