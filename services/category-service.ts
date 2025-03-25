import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { AllCategoriesResponse, CategoryInput, CategoryResponse } from "@/types/category";

export const getAllCategories = createQueryHook<AllCategoriesResponse>('/categories', ['categories']);

export const createCategory = createMutationHook<CategoryInput, CategoryResponse>('/categories', 'post');

export const updateCategory = createMutationHook<CategoryInput, CategoryResponse>('/categories', 'put');

export const deleteCategory = createMutationHook<number, void>('/categories', 'delete');
