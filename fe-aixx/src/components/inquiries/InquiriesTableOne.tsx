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
import { sendInquiryReply } from "@/lib/admin/inquiryReply";


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
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);

  useEffect(() => {
    loadInquiries(page, perPage);
  }, [page, perPage]);

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
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
                            <div className="flex justify-center gap-2">
                              <button
                                  onClick={() => {
                                    setSelectedInquiry(inquiry);
                                    setReplyMessage("");
                                    setShowReplyModal(true);
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Send Reply"
                              >
                                ✎
                              </button>
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
                            </div>
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

          {/* Reply Modal */}
          {showReplyModal && selectedInquiry && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Send Reply</h2>
                    <button
                        onClick={() => setShowReplyModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-4 space-y-2 rounded bg-gray-100 p-3 dark:bg-gray-700">
                    <p><strong>From:</strong> {selectedInquiry.name} ({selectedInquiry.email})</p>
                    <p><strong>Original Message:</strong> {selectedInquiry.message}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Reply</label>
                    <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full rounded border border-gray-300 p-3 dark:bg-gray-700 dark:border-gray-600"
                        rows={5}
                        placeholder="Type your reply here..."
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowReplyModal(false)}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={async () => {
                          if (!replyMessage.trim()) {
                            toast.error("Reply message cannot be empty");
                            return;
                          }
                          setReplySending(true);
                          try {
                            await sendInquiryReply(selectedInquiry.id, replyMessage);
                            toast.success("Reply sent successfully");
                            setShowReplyModal(false);
                            setReplyMessage("");
                            loadInquiries(page, perPage);
                          } catch (error: any) {
                            toast.error(
                                error?.response?.data?.message ||
                                error?.message ||
                                "Failed to send reply"
                            );
                          } finally {
                            setReplySending(false);
                          }
                        }}
                        disabled={replySending}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {replySending ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
