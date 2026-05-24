"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/hooks/usePermission";

type CanProps = {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
};

export default function Can({ permission, children, fallback = null }: CanProps) {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!hasPermission(user, permission)) return <>{fallback}</>;

    return <>{children}</>;
}
