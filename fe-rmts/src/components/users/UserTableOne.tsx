"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { useRouter } from "next/navigation";
import { TrashBinIcon, PencilIcon, EyeIcon, EyeCloseIcon } from "../../icons";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import useUsers from "@/hooks/user/useUsers";
import { UserTableData } from "@/types/user";
import Can from "../permissions/Can";

export default function UserTableOne() {
  const { users, loading, pagination, loadUsers, handleDelete }: {
    users: UserTableData[];
    loading: boolean;
    pagination: any;
    loadUsers: (page: number, perPage: number) => void;
    handleDelete: (id: string | null) => Promise<void>;
  } = useUsers();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUsers(page, perPage);
  }, [page, perPage]);

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <Can permission="users-view">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                    Name
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                    Email
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                    Role(s)
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                    Status
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400" isHeader>
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {!loading && users.length > 0 ? (
                    users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                      </span>
                          </TableCell>

                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {user.email}
                          </TableCell>

                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {user.roles?.map((r) => r.name).join(", ") || "-"}
                          </TableCell>

                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            {user.is_active ? (
                                <span className="flex items-center text-green-600">
                          <EyeIcon className="mr-1 h-4 w-4" /> Active
                        </span>
                            ) : (
                                <span className="flex items-center text-gray-500">
                          <EyeCloseIcon className="mr-1 h-4 w-4" /> Inactive
                        </span>
                            )}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <Can permission="users-update">
                              <button
                                  onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Edit"
                              >  
                                <PencilIcon />
                              </button>
                              </Can>

                              <Can permission="users-delete">
                              <button
                                  onClick={() => {
                                    setUserToDelete(user.id);
                                    setShowConfirmModal(true);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete"
                              >
                                <TrashBinIcon />
                              </button>
                              </Can>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center p-6">
                        {loading ? "Loading..." : "No users found"}
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
                onPageChange={(page) => loadUsers(page, perPage)}
                onPerPageChange={(perPage) => {
                  setPerPage(perPage);
                  setPage(1);
                }}
            />
          </div>

          {/* Confirm Delete Modal */}
          <ConfirmDeleteModal
              isOpen={showConfirmModal}
              onClose={() => {
                setShowConfirmModal(false);
                setUserToDelete(null);
              }}
              onConfirm={async () => {
                try {
                  await handleDelete(userToDelete);
                  setShowConfirmModal(false);
                  setUserToDelete(null);
                  toast.success("User deleted successfully.");
                } catch (error: any) {
                  setShowConfirmModal(false);
                  setUserToDelete(null);
                  toast.error(
                      error?.response?.data?.message ||
                      error?.message ||
                      "Something went wrong while deleting the user."
                  );
                }
              }}
              title="Are you sure?"
              message="This will permanently delete the user."
          />
        </div>
      </div>
  );
}