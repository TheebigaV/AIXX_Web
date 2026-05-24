import {useState, useEffect} from "react";
import {RoleFormData} from "@/types/role";
import {createRole, updateRole} from "@/lib/roles";
import useRoles from "@/hooks/role/useRoles"

export const useRoleForm = (roleId?: string, onSuccess?: () => void) => {

    const {getRole} = useRoles();

    const [formData, setFormData] = useState<RoleFormData>({
        name: "",
        permission_ids: [],
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RoleFormData, string>>>({});
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (roleId) {
            setLoading(true);
            getRole(roleId)
                .then((res) => {
                    console.log("Fetched role data", res.data);
                    setFormData(prev => ({
                        ...prev,
                        ...res.data,
                        permission_ids: res.data.permission_ids ?? [],
                    }));
                })
                .catch(() => setServerError("Failed to fetch role"))
                .finally(() => setLoading(false));
        }
    }, [roleId]);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!formData.name) newErrors.name = "Name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof RoleFormData, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const handleSubmit = async () => {
        if (!validate()) return false;

        setLoading(true);
        try {
            roleId
                ? await updateRole(roleId, formData)
                : await createRole(formData);
            if (onSuccess) onSuccess();
            return true;
        } catch (err: any) {
            if (err.response?.data?.errors) {
                console.log('err.response?.data?.errors',err.response?.data?.errors)
                setErrors(err.response.data.errors);
            } else {
                setServerError("Something went wrong");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        serverError,
        loading,
        handleChange,
        handleSubmit,
    };
};
