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
import {
    TrashBinIcon,
    PencilIcon,
    EyeIcon,
    EyeCloseIcon,
} from "../../icons/index";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import useProjects from "@/hooks/project/useProjects";
import { ProjectTableData } from "@/types/project";
import Can from "../permissions/Can";

export default function ProjectTableOne() {
    const {
        projects,
        loading,
        pagination,
        loadProjects,
        handleDelete,
    }: {
        projects: ProjectTableData[];
        loading: boolean;
        pagination: any;
        loadProjects: (page: number, perPage: number) => void;
        handleDelete: (id: string | null) => Promise<void>;
    } = useProjects();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadProjects(page, perPage);
    }, [page, perPage]);

    return (
        <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[700px]">
                    <Can permission="projects-view">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                    >
                                        Title
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                    >
                                        Date
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {!loading && projects.length > 0 ? (
                                    projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-center">
                                                <span
                                                    className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {project.title}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-center">
                                                {project.date
                                                    ? new Date(project.date).toLocaleDateString()
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-center">
                                                {project.is_active ? (
                                                    <span className="inline-flex items-center text-green-600">
                                                        <EyeIcon className="mr-1 h-4 w-4" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-gray-500">
                                                        <EyeCloseIcon className="mr-1 h-4 w-4" /> Inactive
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center text-theme-sm dark:text-gray-400">
                                                <div className="inline-flex items-center space-x-4">
                                                    <Can permission="projects-update">
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/admin/projects/${project.id}/edit/`)
                                                            }
                                                            className="text-blue-500 hover:text-blue-700"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon />
                                                        </button>
                                                    </Can>

                                                    <Can permission="projects-delete">
                                                        <button
                                                            onClick={() => {
                                                                setProjectToDelete(project.id);
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
                                        <TableCell colSpan={4} className="text-center p-6">
                                            {loading ? "Loading..." : "No projects found"}
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
                        onPageChange={(page) => loadProjects(page, perPage)}
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
                        setProjectToDelete(null);
                    }}
                    onConfirm={async () => {
                        try {
                            await handleDelete(projectToDelete);
                            setShowConfirmModal(false);
                            setProjectToDelete(null);
                            toast.success("Project deleted successfully.");
                        } catch (error: any) {
                            setShowConfirmModal(false);
                            setProjectToDelete(null);
                            toast.error(
                                error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while deleting the project."
                            );
                        }
                    }}
                    title="Are you sure?"
                    message="This will permanently delete the project."
                />
            </div>
        </div>
    );
}