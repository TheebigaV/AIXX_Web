export interface InquiryFormData {
    product_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_interest: string;
    industry_type: string;
    message: string;
}

export interface InquiryFormErrors {
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    service_interest?: string;
    industry_type?: string;
    message?: string;
}