import { StatusMessage } from "./response";

export interface ProductInput {
  name: string;
  sku: string;
  description: string;
  price: number;
  category_id: number;
  image: File; // File untuk upload gambar
  is_active: boolean;
  outlet_ids: number[];
  quantity: number;
  min_stock: number;
}

export interface ProductResponse extends StatusMessage {
  data: Product;
}

export interface GetProductsResponse extends StatusMessage {
  data: Product[];
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: string; // Price dalam bentuk string (misal: "3000.00")
  image: string; // URL gambar
  is_active: boolean;
  category: Category; // Objek kategori
  min_stock: number;
  quantity: number;
  image_url?: string;
  outlets: {
    id: number;
    name: string;
  }[];
}

interface Category {
  id: number;
  name: string;
}

