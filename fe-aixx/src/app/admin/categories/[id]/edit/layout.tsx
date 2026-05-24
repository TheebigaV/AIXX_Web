import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function UsersEditLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="categories-update">
            {children}
        </PermissionWrapper>
    );
}
