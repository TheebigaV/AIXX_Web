"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/hooks/usePermission";

type PermissionWrapperProps = {
  requiredPermission: string;
  children: ReactNode;
};

export default function PermissionWrapper({
  requiredPermission,
  children,
}: PermissionWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user && !hasPermission(user, requiredPermission)) {
      setRedirecting(true);
      router.replace("/unauthorized");
    }
  }, [loading, user, requiredPermission, router]);

  if (loading || redirecting) return <p>Loading...</p>;

  if (!user || !hasPermission(user, requiredPermission)) return null;

  return <>{children}</>;
}
