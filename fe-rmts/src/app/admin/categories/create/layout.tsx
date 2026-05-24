import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function BannersCreateLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="categories-create">
            {children}
        </PermissionWrapper>
    );
}
