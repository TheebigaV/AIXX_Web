"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useDashboard } from "@/hooks/useDashboard";
import Can from "../permissions/Can";
import Link from "next/link";

export default function RecentInquiries() {
  const { metrics, loading } = useDashboard();
  const recentInquiries = metrics?.recentInquiries || [];

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 dark:bg-gray-700"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded dark:bg-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Can permission="enquiries-view">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Inquiries
          </h3>
          <Link 
            href="/admin/inquiries"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry: any) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {inquiry.customer_name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {inquiry.customer_email}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        size="sm"
                        color={inquiry.is_replyed ? "success" : inquiry.is_viewed ? "warning" : "error"}
                      >
                        {inquiry.is_replyed ? "Replied" : inquiry.is_viewed ? "Viewed" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                    No inquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Can>
  );
}
