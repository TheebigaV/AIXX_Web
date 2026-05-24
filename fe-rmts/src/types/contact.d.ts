interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

interface ContactFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}