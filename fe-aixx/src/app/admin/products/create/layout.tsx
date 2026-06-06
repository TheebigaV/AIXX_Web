import PermissionWrapper from "@/components/permissions/PermissionWrapper";

export default function ProductCreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionWrapper requiredPermission="products-create">
      {children}
    </PermissionWrapper>
  );
}
