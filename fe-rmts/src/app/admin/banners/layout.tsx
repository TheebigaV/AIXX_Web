"use client";

import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function BannersLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="banners-view">
            {children}
        </PermissionWrapper>
    );
}
