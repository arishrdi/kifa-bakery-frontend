import { StatusMessage } from "./response";

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  products_count: number;
}

export interface AllCategoriesResponse extends StatusMessage {
  data: Category[];
}

export interface CategoryResponse extends StatusMessage {
  data: Category;
}

export interface CategoryInput extends Omit<Category, "id" | "created_at" | "updated_at" | "products_count"> {}
