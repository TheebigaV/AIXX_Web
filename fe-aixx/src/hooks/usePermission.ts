import { User } from "@/types/auth";

export const hasPermission = (
    user: any | null,
    permission: string
): boolean => {
    if (!user || !user.permissions) return false;

    // Support both old object structure and new string array structure
    return user.permissions.some((perm: any) => 
        typeof perm === 'string' ? perm === permission : perm.name === permission
    );
};

export const hasAnyPermission = (
    user: any | null,
    permissions: string[]
): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some((p) => 
        user.permissions.some((perm: any) => 
            typeof perm === 'string' ? perm === p : perm.name === p
        )
    );
};

export const hasAllPermissions = (
    user: any | null,
    permissions: string[]
): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every((p) =>
        user.permissions.some((perm: any) => 
            typeof perm === 'string' ? perm === p : perm.name === p
        )
    );
};