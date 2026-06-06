// src/hooks/useProducts.ts
import useSWR from 'swr';
import axios from 'axios';

export interface Product {
  id: number;
  name: string;
  description: string;
  image_path?: string;
  slug: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const useProducts = () => {
  const { data, error, mutate } = useSWR<Product[]>('/api/products', fetcher, {
    revalidateOnFocus: false,
  });
  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
