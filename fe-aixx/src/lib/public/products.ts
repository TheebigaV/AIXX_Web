import {api} from "./api";
// import {ProductFormData} from "../types/product";

// export const fetchProducts = (page: number = 1, perPage: number = 10, category:string = '') =>
//     api.get(`/api/products?page=${page}&per_page=${perPage}&category=${category} `);
    // api.get(`/api/products?page=${page}&per_page=${perPage}&category_slug=${category} `);

// In fe-aixx\src\lib\public\products.ts
export const fetchProducts = (page: number = 1, perPage: number = 10, category: string = '', search: string = '' ) =>
    api.get(`/api/products?page=${page}&per_page=${perPage}&category=${category}&name=${search}`);
    

export const fetchAllProducts = () =>
    api.get("/api/products/all");

export const getProduct = (slug: string) =>
    api.get(`/api/products/${slug}/by-slug`);

export const fetchRandomProducts = (count: number = 6) => {
  return api.get(`/api/products/random/${count}`);
};


