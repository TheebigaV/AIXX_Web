export interface BannerFormData {
    page: string;                        // Page where banner is shown (e.g., 'home', 'about')
    title_1: string;                     // Banner title
    title_2?: string;                     // Main image (URL or file path)
    link?: string;                     // Optional redirect link
    subtitle?: string;
    image: File | null; // Optional description/caption   // When banner expires
    is_active: boolean;               // Active or inactive
}
