export interface ProjectFormData {
  name: string;
  date: string;
  description: string;
  thumbnail_image?: File | string ;
    banner_image?: File | string ;
  images: File[];  // optional array of image URLs/base64
  is_action: boolean; // mandatory
}

export interface ProjectImage {
  id: number;
  url: string;
}

export interface ProjectTableData {
  id: number;
  title: string;
  description: string;
  date: string; // ISO format string (e.g., "2025-09-21")
  is_active: boolean;
  banner_image?: File | string;
  images ?: ProjectImage[]; // array of image URLs
}