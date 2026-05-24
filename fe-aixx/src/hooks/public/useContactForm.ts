"use client";

import {useState} from "react";
import { storeContact } from "@/lib/public/contact";
import { ContactFormData, ContactFormErrors } from "@/types/contact";


export function useContactForm(onSuccess?: () => void) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof ContactFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: ContactFormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        setServerError(null);

        try {
            await storeContact(formData); // 👈 backend endpoint
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setServerError(err.response?.data?.message || "Something went wrong");
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
}
