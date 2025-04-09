import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { GetProductsResponse, ProductInput, ProductResponse } from "@/types/product";

// export const getAllProductsByOutlet = (id: number) => createQueryHook<GetProductsResponse>(`/products/outlet/${id}`, ['products']);
export const getAllProductsByOutlet = (id: number) => {
    return createQueryHook<GetProductsResponse>(`/products/outlet/${id}`, ['products-outlet', id.toString()]);
};

export const createProduct = createMutationHook<ProductInput, ProductResponse>('/products', 'post');

export const updateProduct = (id: number) => createMutationHook<ProductInput, ProductResponse>(`/products/${id}`, 'post')();

// export const deleteProduct  = (id: number) => createMutationHook<number, void>(`/products/${id}`, 'delete');

export const deleteProduct = () => {
    return createMutationHook<number, void, void>(
      (id) => `/products/${id}`, 
      'delete'
    )();
  };
