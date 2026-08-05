"use client";
import React from "react";
import Link from "next/link";
import { BoxIconLine, GroupIcon } from "@/icons";
import { useSettings } from "@/hooks/useSettings";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/context/AuthContext";

export const EcommerceMetrics = () => {
  const { user } = useAuth();
  const { metrics, loading: dashLoading, error } = useDashboard();
  const { loading: setLoading } = useSettings();

  const loading = dashLoading || setLoading;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "group":
        return <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />;
      default:
        return <BoxIconLine className="text-gray-800 dark:text-white/90" />;
    }
  };

  const formatValue = (val: number | string) => typeof val === "number" ? val.toLocaleString() : val;

  if (loading) {
    return (
      <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="flex items-end justify-between mt-5">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
                <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="w-full px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-gray-600 dark:text-gray-400">No metrics available</p>
        </div>
      </div>
    );
  }

  const metricsArray: Array<{ label: string; value: number | string; icon: string; link: string }> = [
    { label: "Products", value: metrics.products?.value || 0, icon: "box", link: "/admin/products" },
    { label: "Enquiries", value: metrics.enquiries?.value || 0, icon: "group", link: "/admin/inquiries" },
    { label: "Categories", value: metrics.categories?.value || 0, icon: "box", link: "/admin/categories" },
    { label: "Banners", value: metrics.banners?.value || 0, icon: "box", link: "/admin/banners" },
    { label: "Users", value: metrics.users?.value || 0, icon: "group", link: "/admin/users" },
    { label: "Trainings", value: metrics.trainings?.value || 0, icon: "box", link: "/admin/training" },
  ];

  return (
    <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
      {metricsArray.map((metric, index) => {
        return (
          <Link key={index} href={metric.link} className="block group">
            <div
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-brand-50 text-brand-600 rounded-xl dark:bg-brand-900/30 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                {getIcon(metric.icon)}
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {metric.label}
                  </span>
                  <h4 className={`mt-2 font-black text-gray-900 text-title-sm dark:text-white/90 ${String(metric.value) === 'Active' ? 'text-green-500' : String(metric.value) === 'Inactive' ? 'text-gray-400' : ''}`}>
                    {formatValue(metric.value)}
                  </h4>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};