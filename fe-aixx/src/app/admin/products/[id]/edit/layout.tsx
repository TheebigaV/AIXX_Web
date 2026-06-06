import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function ProductEditLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionWrapper requiredPermission="products-update">
      {children}
    </PermissionWrapper>
  );
}
