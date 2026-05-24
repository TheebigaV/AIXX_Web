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
import useBanners from "@/hooks/banner/useBanners";
import { BannerTableData } from "@/types/banner";
import Can from "../permissions/Can";

export default function BannerTableOne() {
    const {
        banners,
        loading,
        pagination,
        loadBanners,
        handleDelete,
    }: {
        banners: BannerTableData[];
        loading: boolean;
        pagination: any;
        loadBanners: (page: number, perPage: number) => void;
        handleDelete: (id: string | null) => Promise<void>;
    } = useBanners();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadBanners(page, perPage);
    }, [page, perPage]);

    return (
        <div
            className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <Can permission="banners-viewany">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[500px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Title
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Subtitle
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Link
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Status
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
                                {!loading && banners.length > 0 ? (
                                    banners.map((banner) => (
                                        <TableRow key={banner.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {banner.title_1}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {banner.subtitle}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {banner.link ? (
                                                    <a
                                                        href={banner.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {banner.link}
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                {banner.is_active ? (
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
                                                    <Can permission="banners-view">
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/admin/banners/${banner.id}/edit/`)
                                                            }
                                                            className="text-blue-500 hover:text-blue-700"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon />
                                                        </button>
                                                    </Can>

                                                    <Can permission="banners-delete">
                                                        <button
                                                            onClick={() => {
                                                                setBannerToDelete(banner.id);
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
                                            {loading ? "Loading..." : "No banners found"}
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
                            onPageChange={(page) => loadBanners(page, perPage)}
                            onPerPageChange={(perPage) => {
                                setPerPage(perPage);
                                setPage(1);
                            }}
                        />
                    </div>

                    <ConfirmDeleteModal
                        isOpen={showConfirmModal}
                        onClose={() => {
                            setShowConfirmModal(false);
                            setBannerToDelete(null);
                        }}
                        onConfirm={async () => {
                            try {
                                await handleDelete(bannerToDelete);
                                setShowConfirmModal(false);
                                setBannerToDelete(null);
                                toast.success("Banner deleted successfully.");
                            } catch (error: any) {
                                setShowConfirmModal(false);
                                setBannerToDelete(null);
                                toast.error(
                                    error?.response?.data?.message ||
                                    error?.message ||
                                    "Something went wrong while deleting the banner."
                                );
                            }
                        }}
                        title="Are you sure?"
                        message="This will permanently delete the banner."
                    />
                </div>
            </Can>
        </div>
    );
}
