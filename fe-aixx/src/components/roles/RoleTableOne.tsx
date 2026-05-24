"use client"
import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import useRoles from "@/hooks/role/useRoles";
import {useRouter} from "next/navigation";
import {
    TrashBinIcon, PencilIcon,
} from "../../icons/index";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";
import {toast} from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import {RoleTableData} from "@/types/role"
import Can from "../permissions/Can";




export default function RoleTableOne() {

    const {roles, loading, pagination, loadRoles, handleDelete}: {
        roles: RoleTableData[];
        loading: boolean;
        pagination: any;
        loadUsers: (page: number, perPage: number) => void;
        handleDelete: (id: string | null) => Promise<void>;
    } = useRoles();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadRoles(page, perPage);
    },  [page, perPage]);

    return (


        <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[300px]">
                    <Can permission="roles-view">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Role Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

                            {!loading && roles.length > 0 ? (
                                roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                      {role.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center space-x-4">
                                                <Can permission="roles-update">
                                                <button
                                                    onClick={() => router.push(`/admin/roles/${role.id}/edit/`)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Edit"
                                                >
                                                    <PencilIcon/>
                                                </button>
                                                </Can>

                                                <Can permission="roles-delete">
                                                <button
                                                    onClick={() => {
                                                        setRoleToDelete(role.id);
                                                        setShowConfirmModal(true);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <TrashBinIcon/>
                                                </button>
                                                </Can>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                ))) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center p-6">
                                        {loading ? "Loading..." : "No roles found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    </Can>

                </div>
                <div className={"ml-5 mr-5 mb-5"}>
                    <Pagination
                        currentPage={pagination.current_page}
                        perPage={perPage}
                        totalItems={pagination.total}
                        onPageChange={(page) => loadRoles(page,perPage)}
                        onPerPageChange={(perPage) => {
                            setPerPage(perPage);
                            setPage(1); // Reset to first page when perPage changes
                        }}
                    />
                </div>

                <ConfirmDeleteModal
                    isOpen={showConfirmModal}
                    onClose={() => {
                        setShowConfirmModal(false);
                        setRoleToDelete(null);
                    }}
                    onConfirm={async () => {
                        try {
                            await handleDelete(roleToDelete);
                            setShowConfirmModal(false);
                            setRoleToDelete(null);
                            toast.success("Role deleted successfully.");
                        } catch (error: any) {
                            setShowConfirmModal(false);
                            setRoleToDelete(null);
                            toast.error(
                                error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while deleting the role."
                            );
                        }
                    }}
                    title="Are you sure?"
                    message="This will permanently delete the role."
                />

            </div>
        </div>


    );
}
