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
        role_ids: [], // multiple roles
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
    const [serverError, setServerError] = useState("");

    // Load user data for edit
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

    // Validation
    const validate = () => {
        const newErrors: typeof errors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Invalid email";

        // Password required only on create
        if (!userId) {
            if (!formData.password) newErrors.password = "Password is required";
            if (!formData.password_confirmation)
                newErrors.password_confirmation = "Password confirmation is required";
            else if (formData.password !== formData.password_confirmation)
                newErrors.password_confirmation = "Passwords do not match";
        } else {
            // On update, only validate if user entered password
            if (formData.password || formData.password_confirmation) {
                if (formData.password !== formData.password_confirmation)
                    newErrors.password_confirmation = "Passwords do not match";
            }
        }

        if (!formData.role_ids || formData.role_ids.length === 0)
            newErrors.role_ids = "At least one role must be selected"

        if (Object.keys(newErrors).length > 0) {
            console.log("formData errors:", formData);
            console.log("Validation errors:", newErrors);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof UserFormData, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}));
        setErrors((prev) => ({...prev, [field]: undefined}));
    };

    const handleSubmit = async () => {
        if (!validate()) return false;

        setLoading(true);

        try {
            const payload: Partial<UserFormData> = {...formData};

            // Remove password fields if empty on update
            if (userId && !formData.password) {
                delete payload.password;
                delete payload.password_confirmation;
            }

            if (userId) await updateUser(userId, payload);
            else await createUser(payload);

            if (onSuccess) onSuccess();
            return true;
        } catch (err: any) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setServerError("Something went wrong");
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
