'use client';

import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number, isPageNumberClick?: boolean) => void;
  totalCount: number;
  selectedItemsPerPage: number | string;
  itemsPerPageOptions?: (number | string)[];
  handleItemsPerPageChange: (value: string | number) => void;
  isScrolling: boolean;
  navigationInProgressRef?: React.MutableRefObject<boolean>;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isScrolling,
  navigationInProgressRef,
}) => {
  const isDisabled = isScrolling || (navigationInProgressRef?.current ?? false);

  const handlePageClick = (page: number, isPageNumberClick: boolean = false) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page, isPageNumberClick);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (currentPage <= Math.floor(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i, true)}
          className={`beveled-corner1 text-sm sm:text-[16px] md:text-[18px] w-8 sm:w-10 md:w-11 h-8 sm:h-10 md:h-11 flex items-center justify-center font-semibold transition-all duration-300 ease-out
            ${i === currentPage ? 'bg-[#191E42] text-white scale-105' : 'bg-white text-[#191E42] hover:bg-[#191E42] hover:text-white'}`}
          disabled={isDisabled}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="w-full mt-10">
      <div className="flex sm:justify-center xl:justify-end items-center flex-wrap gap-2">
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || isDisabled}
          className="text-[#191E42] p-2 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-110"
          aria-label="First page"
        >
          <FiChevronsLeft size={20} />
        </button>

        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isDisabled}
          className="text-[#191E42] p-2 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-110"
          aria-label="Previous page"
        >
          <FiChevronLeft size={20} />
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || isDisabled}
          className="text-[#191E42] p-2 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-110"
          aria-label="Next page"
        >
          <FiChevronRight size={20} />
        </button>

        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || isDisabled}
          className="text-[#191E42] p-2 rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-110"
          aria-label="Last page"
        >
          <FiChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
};
