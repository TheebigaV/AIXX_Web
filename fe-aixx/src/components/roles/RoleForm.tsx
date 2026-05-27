"use client";

import React, {useEffect, useState} from 'react';
import ComponentCard from '../common/ComponentCard';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import {useParams} from "next/navigation";
import { useRoleForm } from "@/hooks/role/useRoleForm";
import usePermissions from "@/hooks/role/usePermissions";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Checkbox from "@/components/form/input/Checkbox";
import {PermissionData, GroupedPermissions} from "@/types/permissions";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function RoleFrom() {

    const { id: roleId } = useParams();
    const router = useRouter();

    const {
        formData,
        errors,
        loading,
        handleChange,
        handleSubmit,
    } = useRoleForm(roleId as string, () => {
        toast.success("Role saved successfully!");
        router.push("/admin/roles");
    });

    const { permissions, loadAllPermissions } : {
        permissions: PermissionData[];
        loadAllPermissions: () => void;
    } = usePermissions();


    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [grouped, setGrouped] = useState<GroupedPermissions>({});
    const [permissionsLoading, setPermissionsLoading] = useState(false);


    useEffect(() => {
        const fetchPermissions = async () => {
            setPermissionsLoading(true);
            await loadAllPermissions();
            setPermissionsLoading(false);
        };

        fetchPermissions();
    },  []);

    useEffect(() => {
        const groupedData: GroupedPermissions = {};
        if (Array.isArray(permissions)) {
            permissions.forEach((perm) => {
                const [module] = perm.name.split("-");
                if (!groupedData[module]) groupedData[module] = [];
                groupedData[module].push(perm);
            });
        }
        setGrouped(groupedData);
    }, [permissions]);

    const togglePermission = (id: number) => {
        setSelectedPermissions((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((pid) => pid !== id)
                : [...prev, id];
            handleChange("permission_ids", updated.map(String));
            return updated;
        });
    };

    const toggleAll = () => {
        const allIds = permissions.map((p) => p.id);
        const updated = selectedPermissions.length === permissions.length ? [] : allIds;
        setSelectedPermissions(updated);
        handleChange("permission_ids", updated.map(String));
    };

    const isAllSelected = permissions.length > 0 && selectedPermissions.length === permissions.length;

    useEffect(() => {
        if (formData.permissions?.length) {
            const ids = formData.permissions.map((perm: { id: number }) => perm.id);
            setSelectedPermissions(ids);
            handleChange("permission_ids", ids.map(String)); // Optional: sync to formData
        }
    }, [formData.permissions]);
    
    return (
        <ComponentCard title="Personal Information">
            <div>
                <Label>Name</Label>
                <Input
                    value={formData.name}
                    type="text"
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={!!errors.name}
                    hint={errors.name}
                    placeholder="Enter role name"
                />
            </div>
            <div className="space-y-6">

                {/* Select All */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                    <Checkbox
                        checked={isAllSelected}
                        onChange={toggleAll}
                        label="Select All Permissions"
                    />
                </div>
                {permissionsLoading ? (
                   <LoadingSpinner message={"Loading permissions..."}/>
                ) : (
                    <div className="grid md:grid-cols-4 gap-6">
                        {Object.entries(grouped).map(([module, perms]) => (
                            <div key={module} className="bg-white dark:bg-gray-900 border rounded-lg shadow-sm p-4">
                                <h3 className="font-semibold text-gray-700 dark:text-white capitalize mb-2">
                                    {module === "categories" ? "Service Categories" : module}
                                </h3>
                                <div className="space-y-2">
                                    {perms.map((perm) => (
                                        <Checkbox
                                            key={perm.id}
                                            checked={selectedPermissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm.id)}
                                            label={perm.name.replace(`${module}-`, "").replaceAll("-", " ")}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-end space-x-3">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/admin/roles")}
                    >
                        Cancel
                    </Button>
                </div>
                
            </div>
        </ComponentCard>
    );
}
