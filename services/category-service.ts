import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { AllCategoriesResponse, CategoryInput, CategoryResponse } from "@/types/category";

export const getAllCategories = createQueryHook<AllCategoriesResponse>('/categories', ['categories']);

export const createCategory = createMutationHook<CategoryInput, CategoryResponse>('/categories', 'post');

export const useUpdateCategory = (id: number) => {
    return createMutationHook<CategoryInput, CategoryResponse>(`/categories/${id}`, "put")();
  };

// export const useDeleteCategory = (id: number) => {
//     return createMutationHook<void, void>(`/categories/${id}`, 'delete')();
// };

export const useDeleteCategory = () => {
    return createMutationHook<number, void, void>(
      (id) => `/categories/${id}`, // Endpoint dibuat berdasarkan id dari variables
      'delete'
    )();
  };

