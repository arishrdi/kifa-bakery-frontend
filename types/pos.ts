import { Category } from "./category";
import { StatusMessage } from "./response";

export  interface ProductPos {
  product: Product;
  total_stok_akhir: number
}

export interface Product {
  kode_produk: string;
  nama_produk: string;
  harga: string;
  barcode: string;
  kategori_id: number;
  outlet_id: string;
  gambar: string

  category: Category
  
  updated_at: Date;
  created_at: Date;
  id: number;
}

export interface GetPosProductsResponse extends StatusMessage {
  data: ProductPos[];
}
