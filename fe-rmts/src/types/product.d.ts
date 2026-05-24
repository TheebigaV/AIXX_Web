export interface ProductFormData {
  name: string;
  slug: string;
  category_id: string | number;
  images?: string[]; // optional array of image URLs/base64
  description: string;
  application_information?: string;
  additional_information?: string;
  features?: string;
  is_visible: boolean; // mandatory
}
