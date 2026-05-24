"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useSettings } from "@/hooks/useSettings";
import { useDashboard } from "@/hooks/useDashboard";
import Can from "../permissions/Can";

export const EcommerceMetrics = () => {
  const { metrics, loading: dashLoading, error } = useDashboard();
  const { settings, loading: setLoading } = useSettings();

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
      <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
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

  const metricsArray = [
    { label: "Enquiries", value: metrics.enquiries?.value || 0, icon: "group", permission: "enquiries-view" },
    { label: "Categories", value: metrics.categories?.value || 0, icon: "box", permission: "categories-view" },
    { label: "Banners", value: metrics.banners?.value || 0, icon: "box", permission: "banners-viewany" },
    { label: "Users", value: metrics.users?.value || 0, icon: "group", permission: "users-view" },
  ];

  if (settings) {
    metricsArray.push({
      label: "Training Page",
      value: settings.training_page_active === "true" ? "Active" : "Inactive",
      icon: "box",
      permission: "training-view"
    });
  }

  return (
    <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      {metricsArray.map((metric, index) => (
        <Can key={index} permission={metric.permission}>
          <div
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {getIcon(metric.icon)}
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.label}
                </span>
                <h4 className={`mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 ${metric.value === 'Active' ? 'text-green-500' : metric.value === 'Inactive' ? 'text-gray-400' : ''}`}>
                  {formatValue(metric.value)}
                </h4>
              </div>
            </div>
          </div>
        </Can>
      ))}
    </div>
  );
};