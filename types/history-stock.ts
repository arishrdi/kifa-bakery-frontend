export interface HistoryStockResponse {
  meta: Meta;
  data: Data;
}

export interface Data {
  summary_by_type: SummaryByType;
}

export interface SummaryByType {
  adjustment: Adjustment;
  shipment:   Adjustment;
  purchase:   Adjustment;
  sale:       Adjustment;
}

export interface Adjustment {
  total_entries:          number;
  total_quantity_changed: number;
  products:               Product[];
}

export interface Product {
  product_id:             number;
  product_name:           string;
  sku:                    string;
  price:                  string;
  unit:                   Unit;
  stock_as_of_end_date:   string;
  total_quantity_changed: number;
  total_entries:          number;
  entries:                Entry[];
}

export interface Entry {
  id:              number;
  quantity_before: number;
  quantity_after:  number;
  quantity_change: number;
  notes:           null | string;
  created_at:      Date;
}

export enum Unit {
  Pcs = "pcs",
}

export interface Meta {
  start_date:   Date;
  end_date:     Date;
  outlet_id:    string;
  generated_at: Date;
}
