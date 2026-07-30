"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import api from "@/lib/api";
import { FaSearch, FaTrash, FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";

interface Registrant {
  id: number;
  registration_id?: string;
  full_name: string;
  gender: string;
  company_name: string | null;
  phone: string;
  email: string;
  country: string;
  test_score: number | null;
  passed: boolean;
  passed_at: string | null;
  created_at: string;
  uuid: string;
}

type SortField = "full_name" | "email" | "registration_id" | "company_name" | "phone" | "country" | "test_score" | "passed" | "created_at";
type SortOrder = "asc" | "desc";

export default function CertificateRegistrations() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc"); // Last entry first by default
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch registrations from API
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/certificate-registrations", {
        params: {
          page,
          per_page: perPage,
          search,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      setRegistrants(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from || 0,
        to: response.data.to || 0,
      });
    } catch (error: any) {
      console.error("Failed to load registrations:", error);
      toast.error(error.response?.data?.message || "Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [page, perPage, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRegistrations();
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const copyExamLink = (uuid: string) => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const link = `${origin}/ai-certificate/test?token=${uuid}`;
      navigator.clipboard.writeText(link);
      toast.success("Exam link copied to clipboard!");
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/certificate-registrations/${deleteId}`);
      toast.success("Registrant deleted successfully!");
      setShowDeleteModal(false);
      setDeleteId(null);
      // Reload registrations
      fetchRegistrations();
    } catch (error: any) {
      console.error("Failed to delete registrant:", error);
      toast.error("Failed to delete registrant.");
    } finally {
      setDeleting(false);
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <FaArrowUp className="inline ml-1 text-xs" /> : <FaArrowDown className="inline ml-1 text-xs" />;
  };

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle="E-Learning Certificate Registrants" />

      <div className="space-y-6">
        <ComponentCard title="Participants List">
          {/* Top Bar with Search & PerPage Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by candidate name, email, company..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500"
              />
              <button type="submit" className="absolute left-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                <FaSearch className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none bg-white"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Registrants Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-slate-500 text-xs font-semibold uppercase">
                    <th onClick={() => handleSort("registration_id")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Registration ID {renderSortIcon("registration_id")}
                    </th>
                    <th onClick={() => handleSort("full_name")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Candidate Name {renderSortIcon("full_name")}
                    </th>
                    <th onClick={() => handleSort("email")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Email Address {renderSortIcon("email")}
                    </th>
                    <th onClick={() => handleSort("company_name")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Company {renderSortIcon("company_name")}
                    </th>
                    <th onClick={() => handleSort("phone")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Mobile Number {renderSortIcon("phone")}
                    </th>
                    <th onClick={() => handleSort("country")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Country {renderSortIcon("country")}
                    </th>
                    <th onClick={() => handleSort("test_score")} className="cursor-pointer px-6 py-4 text-center hover:text-gray-800 transition-colors">
                      Test Score {renderSortIcon("test_score")}
                    </th>
                    <th onClick={() => handleSort("passed")} className="cursor-pointer px-6 py-4 text-center hover:text-gray-800 transition-colors">
                      Status {renderSortIcon("passed")}
                    </th>
                    <th onClick={() => handleSort("created_at")} className="cursor-pointer px-6 py-4 text-left hover:text-gray-800 transition-colors">
                      Registered Date {renderSortIcon("created_at")}
                    </th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400">
                        <div className="flex justify-center items-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                          <span>Loading registrants...</span>
                        </div>
                      </td>
                    </tr>
                  ) : registrants.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-gray-400">
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    registrants.map((registrant) => (
                      <tr key={registrant.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Registration ID */}
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                          {registrant.registration_id || <span className="text-gray-400 font-normal italic">N/A</span>}
                        </td>

                        {/* Candidate Name & Gender */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{registrant.full_name}</div>
                          <div className="text-xs text-slate-400 capitalize">{registrant.gender}</div>
                        </td>

                        {/* Email & Exam Link */}
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{registrant.email}</div>
                          <button
                            onClick={() => copyExamLink(registrant.uuid)}
                            className="mt-1 text-[10px] text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 hover:underline"
                            title="Copy exam link"
                          >
                            🔗 Copy Exam Link
                          </button>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4">
                          {registrant.company_name ? (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              🏢 {registrant.company_name}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>

                        {/* Mobile Number */}
                        <td className="px-6 py-4">{registrant.phone}</td>

                        {/* Country */}
                        <td className="px-6 py-4">{registrant.country}</td>

                        {/* Test Score */}
                        <td className="px-6 py-4 text-center font-medium">
                          {registrant.test_score !== null ? (
                            <span className={registrant.passed ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                              {registrant.test_score} / 20 ({Math.round((registrant.test_score / 20) * 100)}%)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Not attempted</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          {registrant.passed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                              <FaCheckCircle className="text-green-500 text-[10px]" /> Passed
                            </span>
                          ) : registrant.test_score !== null ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                              <FaTimesCircle className="text-red-500 text-[10px]" /> Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              🕒 Registered
                            </span>
                          )}
                        </td>

                        {/* Registered Date */}
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(registrant.created_at).toLocaleDateString("en-SG", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteClick(registrant.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete registration"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {!loading && registrants.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span className="text-sm text-gray-500">
                Showing {pagination.from} to {pagination.to} of {pagination.total} entries
              </span>
              <Pagination
                currentPage={page}
                perPage={perPage}
                totalItems={pagination.total}
                onPageChange={(p) => setPage(p)}
                onPerPageChange={(pp) => {
                  setPerPage(pp);
                  setPage(1);
                }}
              />
            </div>
          )}
        </ComponentCard>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Registration"
        message="Are you sure you want to delete this registrant? This action is permanent and cannot be undone."
      />
    </div>
  );
}
