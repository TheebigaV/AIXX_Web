"use client";

import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function BannersCreateLayout({ children }: { children: React.ReactNode }) {
    return (
        // <PermissionWrapper requiredPermission="banners-create">
        <div>
            {children}
        </div>

        // </PermissionWrapper>
    );
}
