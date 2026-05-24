import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function UserEditLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="users-update">
            {children}
        </PermissionWrapper>
    );
}
