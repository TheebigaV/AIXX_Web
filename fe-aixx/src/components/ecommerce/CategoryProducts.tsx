"use client";
import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import Can from "../permissions/Can";
import Link from "next/link";

const CategoryProducts: React.FC = () => {
  const { metrics, loading } = useDashboard();
  const categories = metrics?.categoriesWithCount || [];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 dark:bg-gray-700"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded dark:bg-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Can permission="categories-view">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Service Sectors
          </h3>
          <Link 
            href="/admin/categories"
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
          >
            Manage →
          </Link>
        </div>
        
        {categories.length > 0 ? (
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {categories.map((category: any, index: number) => (
              <div 
                key={category.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-semibold text-white bg-brand-500 rounded-full shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No services added yet
          </p>
        )}
      </div>
    </Can>
  );
};

export default CategoryProducts;
