import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function RolesCreateLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="roles-create">
            {children}
        </PermissionWrapper>
    );
}
