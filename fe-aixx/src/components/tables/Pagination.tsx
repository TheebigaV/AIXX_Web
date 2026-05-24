import React from "react";

type PaginationProps = {
    currentPage: number;
    perPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   perPage,
                                                   totalItems,
                                                   onPageChange,
                                                   onPerPageChange,
                                               }) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const startEntry = totalItems === 0 ? 0 :(currentPage - 1) * perPage + 1;
    const endEntry = Math.min(startEntry + perPage - 1, totalItems);

    const generatePages = () => {
        const pages = [];
        pages.push(1);
        if (currentPage > 3) pages.push("...");

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) pages.push("...");
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    const perPageOptions = [10, 25, 50, 100];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            {/* Left Side Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{startEntry}</span> to{" "}
                <span className="font-semibold">{endEntry}</span> of{" "}
                <span className="font-semibold">{totalItems}</span> entries
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
                {/* Rows per page dropdown */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</label>

                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                        className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pagination controls */}
                <div className="flex flex-wrap justify-center space-x-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 sm:px-3 sm:py-1 border rounded-lg hover:bg-gray-100 focus:outline-none disabled:opacity-50 text-gray-600"
                    >
                        Previous
                    </button>

                    {generatePages().map((page, index) =>
                        page === "..." ? (
                            <span
                                key={index}
                                className="px-2 py-1 sm:px-3 sm:py-1 text-gray-500"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => onPageChange(Number(page))}
                                className={`px-2 py-1 sm:px-3 sm:py-1 border rounded-lg focus:outline-none ${
                                    currentPage === page
                                        ? "ring ring-primary bg-primary-light text-gray-800"
                                        : "hover:bg-gray-100 text-gray-600"
                                }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 sm:px-3 sm:py-1 border rounded-lg hover:bg-gray-100 focus:outline-none disabled:opacity-50 text-gray-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
