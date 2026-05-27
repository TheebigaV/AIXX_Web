"use client";
import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import {useRouter} from "next/navigation";
import {
    TrashBinIcon,
    PencilIcon,
    EyeIcon,
    EyeCloseIcon,
} from "../../icons/index";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";
import {toast} from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import useTrainings from "@/hooks/training/useTrainings";
import {TrainingTableData} from "@/types/training";

export default function TrainingTableOne() {
    const {
        trainings,
        loading,
        pagination,
        loadTrainings,
        handleDelete,
    }: {
        trainings: TrainingTableData[];
        loading: boolean;
        pagination: any;
        loadTrainings: (page: number, perPage: number) => void;
        handleDelete: (id: string | null) => Promise<void>;
    } = useTrainings();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [trainingToDelete, setTrainingToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadTrainings(page, perPage);
    }, [page, perPage]);

    const formatType = (type: string) => {
        if (!type) return "-";
        if (type === "newsletters") return "News Letters";
        if (type === "certification") return "Skill Training & Certification";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[500px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                >
                                    Type
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                >
                                    Description
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
                            {!loading && trainings.length > 0 ? (
                                trainings.map((training) => (
                                    <TableRow key={training.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-center">
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {training.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-center">
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {formatType(training.type)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-center max-w-[200px] truncate">
                                            {training.description || "-"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 sm:px-6 text-center">
                                            {training.is_active ? (
                                                <span className="inline-flex items-center text-green-600">
                                                    <EyeIcon className="mr-1 h-4 w-4"/> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-gray-500">
                                                    <EyeCloseIcon className="mr-1 h-4 w-4"/> Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center text-theme-sm dark:text-gray-400">
                                            <div className="inline-flex items-center space-x-4">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/admin/training/${training.id}/edit/`)
                                                    }
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Edit"
                                                >
                                                    <PencilIcon/>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setTrainingToDelete(training.id);
                                                        setShowConfirmModal(true);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <TrashBinIcon/>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center p-6">
                                        {loading ? "Loading..." : "No trainings found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="ml-5 mr-5 mb-5">
                    <Pagination
                        currentPage={pagination.current_page}
                        perPage={perPage}
                        totalItems={pagination.total}
                        onPageChange={(page) => loadTrainings(page, perPage)}
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
                        setTrainingToDelete(null);
                    }}
                    onConfirm={async () => {
                        try {
                            await handleDelete(trainingToDelete);
                            setShowConfirmModal(false);
                            setTrainingToDelete(null);
                            toast.success("Training deleted successfully.");
                        } catch (error: any) {
                            setShowConfirmModal(false);
                            setTrainingToDelete(null);
                            toast.error(
                                error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while deleting the training."
                            );
                        }
                    }}
                    title="Are you sure?"
                    message="This will permanently delete this training item."
                />
            </div>
        </div>
    );
}
