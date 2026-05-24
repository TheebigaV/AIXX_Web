interface InquiryFormData {
    product_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    message: string;
}

interface InquiryFormErrors {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    message?: string;
}