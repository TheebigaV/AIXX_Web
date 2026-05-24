import {api} from "./api";

// CRUD
export const fetchAllPermissions = () =>
    api.get(`/api/admin/permissions`);
