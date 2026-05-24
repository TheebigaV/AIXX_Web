"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import Link from "next/link";

import ContentStatus from "@/components/ecommerce/ContentStatus";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Can from "@/components/permissions/Can";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="px-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back - here&apos;s an overview of your AIXX platform.
          </p>
        </div>

        {/* Main Metrics */}
        <EcommerceMetrics />
      </div>
    </ProtectedRoute>
  );
}