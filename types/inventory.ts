import { Outlet } from "./outlet";
import { Product } from "./product";
import { StatusMessage } from "./response";

export interface Datum {
  product:          Product;
  outlet:           Outlet | null;
  total_stok_akhir: number;
  inventories:      Inventory[];
}

export interface Inventory {
  id:          number;
  tanggal:     Date;
  stok_awal:   number;
  stok_masuk:  number;
  stok_keluar: number;
  stok_akhir:  number;
  keterangan:  string;
}

export interface InventoryAllResponse extends StatusMessage {
  data: Datum[];
}