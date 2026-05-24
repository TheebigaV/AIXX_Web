"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasAllPermissions } from "@/hooks/usePermission";

type CanAllProps = {
    permissions: string[];
    children: ReactNode;
    fallback?: ReactNode;
};

export default function CanAll({
    permissions,
    children,
    fallback = null,
}: CanAllProps) {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!hasAllPermissions(user, permissions)) return <>{fallback}</>;

    return <>{children}</>;
}
