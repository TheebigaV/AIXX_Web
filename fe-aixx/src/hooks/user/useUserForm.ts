import {useState, useEffect} from "react";
import {UserFormData} from "@/types/user";
import {createUser, updateUser} from "@/lib/users";
import useUsers from "@/hooks/user/useUsers";

export const useUserForm = (userId?: string, onSuccess?: () => void) => {
    const {getUser} = useUsers();

    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role_ids: [],
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        getUser(userId)
            .then((res) => {
                setFormData({
                    ...res.data,
                    password: "",
                    password_confirmation: "",
                    role_ids: res.data.roles?.map((role: any) => role.id) ?? [],
                });
            })
            .catch(() => setServerError("Failed to fetch user"))
            .finally(() => setLoading(false));
    }, [userId]);

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Invalid email";

        if (!userId) {
            if (!formData.password) newErrors.password = "Password is required";
            if (!formData.password_confirmation)
                newErrors.password_confirmation = "Password confirmation is required";
            else if (formData.password !== formData.password_confirmation)
                newErrors.password_confirmation = "Passwords do not match";
        } else {
            if (formData.password || formData.password_confirmation) {
                if (formData.password !== formData.password_confirmation)
                    newErrors.password_confirmation = "Passwords do not match";
            }
        }

        if (!formData.role_ids || formData.role_ids.length === 0)
            newErrors.role_ids = "At least one role must be selected"

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof UserFormData, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}));
        setErrors((prev) => ({...prev, [field]: undefined}));
        setServerError("");
    };

    const handleSubmit = async () => {
        if (!validate()) {
            console.error("Validation failed:", errors);
            return false;
        }

        setLoading(true);
        setServerError("");

        try {
            const payload: Partial<UserFormData> = {
                ...formData,
                is_active: formData.is_active ?? true,
            };

            if (userId && !formData.password) {
                delete payload.password;
                delete payload.password_confirmation;
            }

            console.log("Submitting user data:", payload);

            if (userId) {
                await updateUser(userId, payload);
            } else {
                await createUser(payload);
            }

            if (onSuccess) onSuccess();
            return true;
        } catch (err: any) {
            console.error("User form error:", err);
            const errorMessage = err.response?.data?.message ||
                                err.response?.data?.errors ||
                                err.message ||
                                "Something went wrong";

            if (typeof errorMessage === 'object') {
                setErrors(errorMessage);
            } else {
                setServerError(errorMessage);
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
