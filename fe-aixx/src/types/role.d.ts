export interface RoleFormData {
    name: string;
    permission_ids: string[];
    permissions?: { id: number; name: string }[];
}

export interface RoleTableData  {
    id: number;
    name: string;
}