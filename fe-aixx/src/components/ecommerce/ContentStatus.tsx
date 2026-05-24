"use client";
import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useSettings } from "@/hooks/useSettings";
import Can from "../permissions/Can";

const ContentStatus: React.FC = () => {
  const { metrics, loading: dashboardLoading } = useDashboard();
  const { settings, loading: settingsLoading } = useSettings();
  const contentStatus = metrics?.contentStatus;

  const loading = dashboardLoading || settingsLoading;

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 dark:bg-gray-700"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded dark:bg-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  const statusItems = [];

  if (contentStatus) {
    statusItems.push(
      { 
        label: "Total Content Items", 
        value: contentStatus.total_content, 
        color: "text-blue-600 dark:text-blue-400" 
      },
      { 
        label: "Active Services", 
        value: contentStatus.categories_active, 
        color: "text-orange-600 dark:text-orange-400" 
      },
      { 
        label: "Active Banners", 
        value: contentStatus.banners_active, 
        color: "text-red-600 dark:text-red-400" 
      }
    );
  }

  if (settings) {
    statusItems.push({
      label: "Training Page Status",
      value: settings.training_page_active === "true" ? "Active" : "Inactive",
      color: settings.training_page_active === "true" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
    });
  }

  if (statusItems.length === 0) {
    return null;
  }

  return (
    <Can permission="dashboard-view">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Platform Content Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
              <span className={`text-xl font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Can>
  );
};

export default ContentStatus;
