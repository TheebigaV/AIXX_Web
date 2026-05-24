import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="users-view">
            {children}
        </PermissionWrapper>
    );
}
