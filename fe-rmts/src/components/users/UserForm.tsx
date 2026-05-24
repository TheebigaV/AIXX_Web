"use client";
import React, {useState, useRef, useEffect} from 'react';
import ComponentCard from '../common/ComponentCard';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import {EyeCloseIcon, EyeIcon} from '../../icons';
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import {useParams} from "next/navigation";
import {useUserForm} from "@/hooks/user/useUserForm";
import Button from "@/components/ui/button/Button";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import ActiveToggle from '../common/ActiveToggle';
import useRoles from "@/hooks/role/useRoles"

export default function UserForm() {
    const {id: userId} = useParams();
    const router = useRouter();

    const {
        formData,
        errors,
        serverError,
        loading,
        handleChange,
        handleSubmit,
    } = useUserForm(userId as string, () => {
        toast.success("User saved successfully!");
        router.push("/admin/users");
    });

    const selectRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [roleOptions, setRoleOptions] = useState<{ value: number; label: string }[]>([]);


    const handleActiveToggle = () => handleChange("is_active", !formData.is_active);
    const handleSelectToggle = () => setIsSelectOpen(prev => !prev);

    const {roles, getAllRoles}: {
        roles: [];
        getAllRoles: () => void;
    } = useRoles();

    const handleRoleChange = (value: string | number) => {
        handleChange("role_ids", typeof value === 'string' ? parseInt(value, 10) : value);
        setIsSelectOpen(false);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            setRolesLoading(true);
            await getAllRoles();
            setRoleOptions(roles.map((role) => ({
                value: role.id,
                label: role.name
            })));
            console.log('roles', roles)
            console.log('roleOptions', roleOptions)
            setRolesLoading(false);
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        const setRoles = async () => {
            setRolesLoading(true);
            setRoleOptions(roles.map((role) => ({
                value: role.id,
                text: role.name
            })));
            setRolesLoading(false);
        };

        setRoles();
    }, [roles]);


    return (
        <ComponentCard title="User Information">

            {serverError && <div className="mb-4 text-red-500">{serverError}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" required>Full Name</Label>
                    <Input
                        id="name"
                        value={formData.name || ''}
                        type="text"
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        hint={errors.name}
                        placeholder="Enter full name"
                        autoComplete="name"
                        maxLength={255}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" required>Email Address</Label>
                    <Input
                        id="email"
                        value={formData.email || ''}
                        type="email"
                        error={!!errors.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Enter email address"
                        hint={errors.email}
                        autoComplete="email"
                        maxLength={255}
                    />
                </div>
            </div>


            {roleOptions.length > 0 ? (
                <div className="space-y-2" ref={selectRef}>
                    <Label>User Role</Label>
                    <MultiSelect
                        options={roleOptions}
                        value={formData.role_ids}
                        defaultSelected={formData.role_ids}
                        onChange={handleRoleChange}
                        isOpen={isSelectOpen}
                        onToggle={handleSelectToggle}
                        placeholder="Select user role"
                        error={!!errors.role_ids}
                        hint={errors.role_ids}
                        multiple
                    />
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No roles available</p>
            )}

            {/* Password fields - show for both create and edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={"Enter password (minimum 8 characters)"}
                            value={formData.password || ''}
                            onChange={(e) => handleChange("password", e.target.value)}
                            error={!!errors.password}
                            hint={errors.password}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ?
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400"/> :
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                            }
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={formData.password_confirmation || ''}
                            onChange={(e) => handleChange("password_confirmation", e.target.value)}
                            error={!!errors.password_confirmation}
                            hint={errors.password_confirmation}

                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ?
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400"/> :
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Active */}
            <div>
                <Label>Account Status</Label>
                <ActiveToggle
                    isActive={!!formData.is_active}
                    onToggle={() => handleChange("is_active", !formData.is_active)}
                />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push("/admin/users")}
                >
                    Cancel
                </Button>
            </div>

        </ComponentCard>
    );
}