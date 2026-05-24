export interface Product {
  availableItems: unknown;
  category: string;
  count: string;

  id: string;
  name:string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  features?: string[];
  specifications?: {
    key: string;
    value: string;
  }[];
  relatedProducts?: string[];
  applicationInfo?: string[];
  additionalInfo?: string[];
  thumbnails?: string[];
  technicalDetails?: string;
  main_product_image: ProductImage;
}

export interface MenuItem {
  name: string;
  href: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
}