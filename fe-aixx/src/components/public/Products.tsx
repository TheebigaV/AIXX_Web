'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiImage, FiChevronDown } from 'react-icons/fi';
import { productMenuItems } from '@/components/public/data/productMenuItems';
import ProductList from '@/components/public/ProductList';
import { Pagination } from '@/components/public/Pagination';
import useProducts from '@/hooks/public/useProducts';
// import { getPaginatedGalleryData } from '@/components/public/data/productService';
// import { Product } from '@/components/public/data/productTypes';
// import { get } from 'http';

interface ProductsProps {
  slug: string;
}

const getResponsiveLayout = (itemsPerPage: number, width: number) => {
  if (itemsPerPage === 12) {
    return { gridColumns: 'grid-cols-4', rows: 3, imageHeight: 240, imageWidth: 160 };
  }
  if (width >= 1920) {
    const cols = Math.min(itemsPerPage, 5); // ensures max 5 cards per row
    return { gridColumns: `grid-cols-${cols}`, rows: Math.ceil(itemsPerPage / cols), imageHeight: 260, imageWidth: 180 };
  }

  if (width >= 1400) {
    const cols = itemsPerPage >= 15 ? 5 : 4;
    return { gridColumns: `grid-cols-${cols}`, rows: Math.ceil(itemsPerPage / cols), imageHeight: 240, imageWidth: 160 };
  }
  if (width >= 1024) return { gridColumns: 'grid-cols-3', rows: Math.ceil(itemsPerPage / 3), imageHeight: 220, imageWidth: 140 };
  if (width >= 768) return { gridColumns: 'grid-cols-2', rows: Math.ceil(itemsPerPage / 2), imageHeight: 200, imageWidth: 120 };
  return { gridColumns: 'grid-cols-1', rows: itemsPerPage, imageHeight: 180, imageWidth: 100 };
};

const Products: React.FC<ProductsProps> = ({ slug }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const navigationInProgressRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  // const [totalCount, setTotalCount] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  // const [isPageChanging, setIsPageChanging] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const itemsPerPageOptions = ['All', 2, 5, 10, 12, 15, 20];
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(12);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState({
    itemsPerPage: 12,
    gridColumns: 'grid-cols-4',
    rows: 3,
    imageHeight: 240,
    imageWidth: 160,
    itemHeight: 340,
  });

  const category = productMenuItems.find((item) => item.href === `/product/${slug}`);
  const categoryName = category?.name || slug.replace(/-/g, ' ');

  const getDefaultItemsPerPage = useCallback(() => {
    if (typeof window === 'undefined') return 12;
    const width = window.innerWidth;
    if (width >= 1920) return 15;
    if (width >= 1400) return 12;
    return 12;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowItemsPerPageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cancelScroll = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    setIsScrolling(false);
  }, []);

  // const smoothScrollToTop = useCallback(
  //   (duration = 600) => {
  //     cancelScroll();
  //     const start = window.pageYOffset;
  //     if (start === 0) return Promise.resolve();
  //     return new Promise<void>((resolve) => {
  //       let startTime: number | null = null;
  //       const animate = (time: number) => {
  //         if (!startTime) startTime = time;
  //         const elapsed = time - startTime;
  //         const progress = Math.min(elapsed / duration, 1);
  //         const ease = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  //         window.scrollTo(0, start * (1 - ease));
  //         if (elapsed < duration) {
  //           scrollAnimationRef.current = requestAnimationFrame(animate);
  //         } else {
  //           window.scrollTo(0, 0);
  //           setIsScrolling(false);
  //           scrollAnimationRef.current = null;
  //           resolve();
  //         }
  //       };
  //       setIsScrolling(true);
  //       scrollAnimationRef.current = requestAnimationFrame(animate);
  //     });
  //   },
  //   [cancelScroll]
  // );

  useEffect(() => {
    const handleResize = () => setSelectedItemsPerPage(getDefaultItemsPerPage());
    setSelectedItemsPerPage(getDefaultItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDefaultItemsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      const layout = getResponsiveLayout(selectedItemsPerPage, window.innerWidth);
      setLayoutConfig({
        ...layout,
        itemsPerPage: selectedItemsPerPage,
        itemHeight: layout.imageHeight + 100,
      });
    };

    handleResize(); // initial call
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedItemsPerPage]);


  const { products, loading, error: fetchError, getAllProducts, loadProducts, pagination } = useProducts();


  // In your handlePageChange function
  const handlePageChange = useCallback(
    async (page: number) => {
      if (page === pagination.current_page || navigationInProgressRef.current) return;
      navigationInProgressRef.current = true;
      try {
        const query = new URLSearchParams(searchParams.toString());
        query.set('page', page.toString());
        query.delete('search'); // Remove old search parameter
        // Keep 'name' parameter if it exists
        router.push(`${pathname}?${query.toString()}`);
        await loadProducts(page, selectedItemsPerPage, searchQuery);
      } finally {
        navigationInProgressRef.current = false;
      }
    },
    [pagination.current_page, router, searchParams, pathname, loadProducts, selectedItemsPerPage, searchQuery]
  );

  const handleItemsPerPageChange = useCallback(
    (value: string | number) => {
      const numericValue = typeof value === 'string' ? parseInt(value) : value;
      setShowItemsPerPageDropdown(false);

      if (isScrolling || navigationInProgressRef.current) return;

      setSelectedItemsPerPage(numericValue);
      setCurrentPage(1);

      const query = new URLSearchParams(searchParams.toString());
      query.set('per_page', numericValue.toString());
      query.delete('page');
      router.push(`${pathname}?${query.toString()}`);
      loadProducts(1, numericValue, searchQuery);
    },
    [isScrolling, navigationInProgressRef, router, pathname, searchParams, searchQuery, loadProducts]
  );

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setCurrentPage(1);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const query = new URLSearchParams(searchParams.toString());
        query.delete('name');
        if (value.length >= 1) {
          query.set('name', value);
        }
        query.delete('page');

        router.push(`${pathname}?${query.toString()}`);

        // Pass the current category slug always
        console.log("selectedItemsPerPage, slug, value:", selectedItemsPerPage, slug, value)
        loadProducts(1, selectedItemsPerPage, slug, value);
      }, 500);
    },
    [searchParams, pathname, router, loadProducts, selectedItemsPerPage, slug]
  );


  // useEffect(() => {
  //     const page = parseInt(searchParams.get('page') || '1');
  //     const perPage = parseInt(searchParams.get('per_page') || '12');
  //     const search = searchParams.get('name') || ''; 

  //     setSearchQuery(search);
  //     setSelectedItemsPerPage(perPage);

  // loadProducts(page, perPage, search ? '' : slug, search);
  // }, [slug, searchParams]); 


  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const search = searchParams.get('name') || '';

    setSearchQuery(search);
    setSelectedItemsPerPage(perPage);

    // ALWAYS pass the slug (category), whether searching or not
    loadProducts(page, perPage, slug, search);
  }, [slug, searchParams, loadProducts]);

  return (
    <div className=" bg-white py-10 font-lato">
      <style jsx>{`
        @media (min-width: 1920px) {
          .header-container {
            margin-left: -3rem;
          }
        }
      `}</style>

      <div className="container mx-auto sm:px-[16px] md:px-[24px] xl:px-[60px] 2xl:pl-[290px] 2xl:px-[240px]">
                {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 header-container">
          <div>
            <h1 className="text-2xl sm:text-3xl text-gray-900 capitalize font-medium">{categoryName}</h1>
            {products.length > 0 && (
              <div className="flex items-center mt-1 gap-3 text-sm text-gray-600">
                <p className="w-full sm:w-auto">
                  Showing {(pagination.current_page - 1) * selectedItemsPerPage + 1}-
                  {Math.min(pagination.current_page * selectedItemsPerPage, pagination.total)} of {pagination.total} items
                </p>

                <div className="relative inline-block" ref={dropdownRef}>
                  <button
                    onClick={() => setShowItemsPerPageDropdown((prev) => !prev)}
                    className="flex items-center gap-1 border border-gray-300 px-3 py-1 hover:border-gray-400"
                  >
                    {selectedItemsPerPage}
                    <FiChevronDown
                      className={`transition-transform duration-200 ${showItemsPerPageDropdown ? 'rotate-180' : ''}`}
                      size={14}
                    />
                  </button>
                  {showItemsPerPageDropdown && (
                    <div className="absolute left-0 mt-1 z-10 bg-white border border-gray-300 shadow rounded w-24">
                      {itemsPerPageOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleItemsPerPageChange(option)}
                          className={`w-full px-3 py-2 text-sm hover:bg-gray-100 ${selectedItemsPerPage === option ? 'bg-blue-100 text-blue-600' : ''
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-[30%] relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="absolute right-3 inset-y-0 flex items-center">
              <FiSearch className="text-gray-400" size={16} />
            </div>
          </div>




        </div>

        {loading ? (
          <p className="text-center py-60">Loading...</p>
        ) : products.length > 0 ? (
          <>
            <ProductList
              products={products}
              totalCount={pagination.total}
              currentPage={pagination.current_page}
              itemsPerPage={selectedItemsPerPage}
            />
            <Pagination
              currentPage={pagination.current_page}
              totalPages={Math.ceil(pagination.total / selectedItemsPerPage)}
              totalCount={pagination.total}
              selectedItemsPerPage={selectedItemsPerPage}
              handleItemsPerPageChange={handleItemsPerPageChange}
              onPageChange={handlePageChange}
              isScrolling={isScrolling}
              navigationInProgressRef={navigationInProgressRef}
            />

          </>
        ) : (
          <div className="text-center py-16">
            <FiImage size={80} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium">No products found</h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;