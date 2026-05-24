// src/products/productService.ts
import { PRODUCT_DATA } from '@/components/public/data/ProductData';
import { productMenuItems } from './productMenuItems';
import { Product } from './productTypes';

const productsWithRelations = PRODUCT_DATA.map(product => {
  if (!product.relatedProducts) {
    const relatedProducts = PRODUCT_DATA
      .filter(p => p.slug === product.slug && p.id !== product.id)
      .slice(0, 3)
      .map(p => p.id);
    return { ...product, relatedProducts };
  }
  return product;
});

export const products = productsWithRelations;

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const generateGalleryData = (slug: string): Product[] => {
  if (!slug) return [];
  return products.filter(product => product.slug === slug);
};

export const getPaginatedGalleryData = (
  slug: string,
  page: number,
  query: string,
  perPage: number
) => {
  const allItems = products.filter((item) => item.slug === slug);

  const filtered = allItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage)); 
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    items: filtered.slice(start, end),
    totalCount,
    totalPages,
  };
};

export const getRelatedProducts = (product: Product): Product[] => {
  if (!product.relatedProducts || product.relatedProducts.length === 0) {
    return products
      .filter(p => p.slug === product.slug && p.id !== product.id)
      .slice(0, 4);
  }
  return product.relatedProducts
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined);
};

export const getCategoryName = (slug: string): string => {
  const category = productMenuItems.find(item => item.href === `/product/${slug}`);
  return category?.name || slug.replace(/-/g, ' ');
};