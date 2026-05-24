"use client";

import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function BannersEditLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="banners-update">
            {children}
        </PermissionWrapper>
    );
}