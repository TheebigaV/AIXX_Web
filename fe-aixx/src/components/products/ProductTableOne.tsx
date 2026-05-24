"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ ADD THIS LINE!

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
import useProducts from "@/hooks/product/useProducts";
import { ProductTableData } from "@/types/product";
import Can from "../permissions/Can";

export default function ProductTableOne() {
  const searchParams = useSearchParams(); // ✅ NEW: Get URL params
  const categoryId = searchParams.get("category_id"); // ✅ NEW: Get category from URL

  const {
    products,
    loading,
    pagination,
    loadProducts,
    handleDelete,
  }: {
    products: ProductTableData[];
    loading: boolean;
    pagination: any;
    loadProducts: (page: number, perPage: number, categoryId?: string | null) => void; // ✅ UPDATED
    handleDelete: (id: string | null) => Promise<void>;
  } = useProducts();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProducts(page, perPage);
  }, [page, perPage, categoryId]); // ✅ Added categoryId dependency

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* ✅ NEW: Show active category filter */}
      {categoryId && (
        <div className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-white/[0.05]">
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Filtered by Category ID: {categoryId}
          </span>
          <button 
            onClick={() => router.push("/admin/products")}
            className="ml-3 text-xs text-red-500 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <Can permission="products-view">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">
                    Slug
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">
                    Category
                  </TableCell>
                  {/*<TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">*/}
                  {/*  Description*/}
                  {/*</TableCell>*/}
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {!loading && products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        {product.slug}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        {product.category?.name ?? "-"}
                      </TableCell>
                      {/*<TableCell className="px-5 py-4 sm:px-6 text-center">*/}
                      {/*  {product.description ?? "-"}*/}
                      {/*</TableCell>*/}
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        {product.is_active ? (
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
                          <Can permission="products-update">
                            <button
                              onClick={() => router.push(`/admin/products/${product.id}/edit/`)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit"
                            >
                              <PencilIcon />
                            </button>
                          </Can>

                          <Can permission="products-delete">
                            <button
                              onClick={() => {
                                setProductToDelete(product.id);
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
                    <TableCell colSpan={6} className="text-center p-6">
                      {loading ? "Loading..." : "No products found"}
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
            onPageChange={(page) => loadProducts(page, perPage, categoryId)}
            onPerPageChange={(perPage) => {
              setPerPage(perPage);
              setPage(1);
            }}
          />
        </div>

        {/* Delete Modal */}
        <ConfirmDeleteModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setProductToDelete(null);
          }}
          onConfirm={async () => {
            try {
              await handleDelete(productToDelete);
              setShowConfirmModal(false);
              setProductToDelete(null);
              toast.success("Product deleted successfully.");
            } catch (error: any) {
              setShowConfirmModal(false);
              setProductToDelete(null);
              toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while deleting the product."
              );
            }
          }}
          title="Are you sure?"
          message="This will permanently delete the product."
        />
      </div>
    </div>
  );
}