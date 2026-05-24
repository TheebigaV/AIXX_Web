"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasAnyPermission } from "@/hooks/usePermission";

type CanAnyProps = {
    permissions: string[];
    children: ReactNode;
    fallback?: ReactNode;
};

export default function CanAny({
    permissions,
    children,
    fallback = null,
}: CanAnyProps) {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!hasAnyPermission(user, permissions)) return <>{fallback}</>;

    return <>{children}</>;
}

