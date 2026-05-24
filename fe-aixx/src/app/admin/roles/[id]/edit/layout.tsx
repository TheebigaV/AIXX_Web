import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function RolesEditLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="roles-update">
            {children}
        </PermissionWrapper>
    );
}
