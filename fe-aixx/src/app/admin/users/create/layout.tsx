import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function UserCreateLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="users-view">
            {children}
        </PermissionWrapper>
    );
}
