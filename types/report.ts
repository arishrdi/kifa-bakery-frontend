export interface LaporanPenjualanResponse {
  status:  string;
  message: string;
  data:    Data;
}

export interface Data {
  omset:                 Omset[];
  outlet:                Outlet;
  best_selling_products: any[];
  summary:               Summary;
}

export interface Omset {
  total_omset:        string;
  total_transactions: number;
  period:             Date;
}

export interface Outlet {
  id:          number;
  nama_outlet: string;
  alamat:      string;
  created_at:  null;
  updated_at:  null;
}

export interface Summary {
  total_omset:             number;
  total_transactions:      number;
  average_per_transaction: number;
  start_date:              Date;
  end_date:                Date;
  group_by:                string;
}
