export interface TrainingFormData {
  id?: string;
  name: string;
  slug?: string;
  type: string;
  description?: string;
  duration?: string;
  sub_modules?: string;
  domestic_fee?: string;
  international_fee?: string;
  highlights?: string;
  is_active: boolean;
  image?: File | null;
}

export interface TrainingTableData {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  duration?: string;
  sub_modules?: string;
  domestic_fee?: string;
  international_fee?: string;
  highlights?: string;
  is_active: boolean;
  image?: {
    id: string;
    url: string;
    name: string;
  } | null;
}
