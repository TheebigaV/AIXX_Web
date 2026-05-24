import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function InquiriesLayout({children}: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="enquiries-view">
            {children}
        </PermissionWrapper>
    );
}
