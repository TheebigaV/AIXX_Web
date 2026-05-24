import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function RolesLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="roles-view">
            {children}
        </PermissionWrapper>
    );
}
