import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function TrainingEditLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="training-update">
            {children}
        </PermissionWrapper>
    );
}
