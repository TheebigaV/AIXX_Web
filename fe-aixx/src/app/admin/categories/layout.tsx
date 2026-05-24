import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="categories-view">
            {children}
        </PermissionWrapper>
    );
}
