import { StatusMessage } from "./response";

export interface AllOutletsResponse extends StatusMessage {
  data: Outlet[];
}

export interface OutletResponse extends StatusMessage {
  data: Outlet;
}

export interface Outlet {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  tax: number;
  qris: string;
  qris_url: string;
  is_active: boolean;
  created_at: null;
  updated_at: null;
  atas_nama_bank: string,
  nama_bank: string,
  nomor_transaksi_bank: string,
}

export interface OutletInput extends Omit<Outlet, "id" | "created_at" | "updated_at"> { }
