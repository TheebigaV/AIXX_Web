export interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  image?: File | null;
}

export interface CategoriesData  {
  id: number;
  name: string;
}