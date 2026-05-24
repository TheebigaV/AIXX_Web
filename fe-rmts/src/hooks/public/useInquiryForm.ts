"use client";

import { useState } from "react";
import { storeInquiry } from "@/lib/public/inquiries";
import { InquiryFormData, InquiryFormErrors } from "@/types/inquiry";

export function useInquiryForm(onSuccess?: () => void) {
    const [formData, setFormData] = useState<InquiryFormData>({
        product_id: "",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        message: "",
    });

    const [errors, setErrors] = useState<InquiryFormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof InquiryFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: InquiryFormErrors = {};

        if (!formData.customer_name.trim()) newErrors.customer_name = "Name is required";
        if (!formData.customer_email.trim()) {
            newErrors.customer_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
            newErrors.customer_email = "Enter a valid email";
        }
        if (!formData.customer_phone.trim()) newErrors.customer_phone = "Phone number is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        setServerError(null);

        try {
            await storeInquiry(formData);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            console.log('err', err)
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