export interface PermissionData  {
    id: number;
    name: string;
}

export type GroupedPermissions = {
    [module: string]: PermissionData[];
};