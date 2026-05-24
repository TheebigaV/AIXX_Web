"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { TrashBinIcon, EyeIcon, EyeCloseIcon } from "../../icons/index";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import useInquiries from "@/hooks/inquiry/useInquiries";
import Can from "../permissions/Can";

export default function InquiryTableOne() {
  const {
    inquiries,
    loading,
    pagination,
    loadInquiries,
    handleDelete,
  }: {
    inquiries: any[];
    loading: boolean;
    pagination: any;
    loadInquiries: (page: number, perPage: number) => void;
    handleDelete: (id: string | null) => Promise<void>;
  } = useInquiries();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadInquiries(page, perPage);
  }, [page, perPage]);

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Can permission="enquiries-view">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs">
                    Phone
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs">
                    Message
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-500 text-theme-xs">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {!loading && inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-center font-medium text-gray-800 dark:text-white/90">
                            {inquiry.name}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-center">
                            {inquiry.email}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-center">
                            {inquiry.customer_phone || "-"}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-center">
                            {inquiry.message}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-center">
                            {inquiry.is_replyed ? (
                                <span className="inline-flex items-center text-green-600">
                                                    <EyeIcon className="mr-1 h-4 w-4" /> Replied
                                                </span>
                            ) : (
                                <span className="inline-flex items-center text-gray-500">
                                                    <EyeCloseIcon className="mr-1 h-4 w-4" /> Pending
                                                </span>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center text-theme-sm dark:text-gray-400">
                            <Can permission="enquiries-delete">
                            <button
                                onClick={() => {
                                  setEnquiryToDelete(inquiry.id);
                                  setShowConfirmModal(true);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                            >
                              <TrashBinIcon />
                            </button>
                            </Can>
                          </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center p-6">
                        {loading ? "Loading..." : "No enquiries found"}
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
            </Can>
          </div>

          {/* Pagination */}
          <div className="ml-5 mr-5 mb-5">
            <Pagination
                currentPage={pagination.current_page}
                perPage={perPage}
                totalItems={pagination.total}
                onPageChange={(page) => setPage(page)}
                onPerPageChange={(perPage) => {
                  setPerPage(perPage);
                  setPage(1);
                }}
            />
          </div>

          {/* Delete Confirm Modal */}
          <ConfirmDeleteModal
              isOpen={showConfirmModal}
              onClose={() => {
                setShowConfirmModal(false);
                setEnquiryToDelete(null);
              }}
              onConfirm={async () => {
                try {
                  await handleDelete(enquiryToDelete);
                  setShowConfirmModal(false);
                  setEnquiryToDelete(null);
                  toast.success("Inquiry deleted successfully.");
                } catch (error: any) {
                  setShowConfirmModal(false);
                  setEnquiryToDelete(null);
                  toast.error(
                      error?.response?.data?.message ||
                      error?.message ||
                      "Something went wrong while deleting the inquiry."
                  );
                }
              }}
              title="Are you sure?"
              message="This will permanently delete the inquiry."
          />
        </div>
      </div>
  );
}
