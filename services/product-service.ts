import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { GetProductsResponse, ProductInput, ProductResponse } from "@/types/product";

// export const getAllProductsByOutlet = (id: number) => createQueryHook<GetProductsResponse>(`/products/outlet/${id}`, ['products']);
export const getAllProductsByOutlet = (id: number) => {
    return createQueryHook<GetProductsResponse>(`/products/outlet/${id}`, ['products-outlet', id.toString()]);
};

export const createProduct = createMutationHook<ProductInput, ProductResponse>('/products', 'post');

export const updateProduct = createMutationHook<ProductInput, ProductResponse>('/products', 'put');

export const deleteProduct = createMutationHook<number, void>('/products', 'delete');


