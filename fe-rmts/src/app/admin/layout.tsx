import React from "react";

import {AuthProvider} from "@/context/AuthContext";
import AdminAuthWrapper from "@/layout/AdminAuthWrapper";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {

    return (
        <AuthProvider>
            <AdminAuthWrapper>
                {children}
            </AdminAuthWrapper>
        </AuthProvider>
    );
}
