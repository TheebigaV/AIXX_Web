// fe-aixx/src/hooks/useDashboard.ts
"use client";
import { useEffect, useState } from "react";
import { fetchDashboardMetrics } from "@/lib/dashboard";

export interface MetricData {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down';
  icon: string;
  active?: number;
}

export interface DashboardMetrics {
  enquiries: MetricData;
  categories: MetricData;
  banners: MetricData;
  users: MetricData;
  recentInquiries?: any[];
  contentStatus?: {
    total_content: number;
    categories_active: number;
    banners_active: number;
  };
  categoriesWithCount?: any[];
}

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchDashboardMetrics();
        
        console.log('API Response:', response);
        
        // Axios wraps response in 'data', Laravel wraps in 'success' and 'data'
        // So: response.data.data contains the actual metrics
        if (response?.data?.success && response?.data?.data) {
          console.log('Setting metrics:', response.data.data);
          setMetrics(response.data.data);
        } else if (response?.data?.data) {
          console.log('Setting metrics (no success):', response.data.data);
          setMetrics(response.data.data);
        } else if (response?.data) {
          console.log('Setting metrics from response.data:', response.data);
          setMetrics(response.data);
        } else {
          setError('Unexpected response format from server');
        }
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return { metrics, loading, error };
};