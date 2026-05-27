import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function TrainingCreateLayout({ children }: { children: React.ReactNode }) {
    return (
        <PermissionWrapper requiredPermission="training-create">
            {children}
        </PermissionWrapper>
    );
}
