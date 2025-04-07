import { Product } from "./product";
import { StatusMessage } from "./response";

export interface RealtimeStockResponse extends StatusMessage {
  data: Inventory[];
}

export interface GetInventoryByDateResponse extends StatusMessage {
  data: {
    date: Date;
    outlet: string;
    is_realtime: boolean;
    inventory_items: {
      product_id: number;
      product_name: string;
      sku: string;
      category: string;
      quantity: number;
      min_stock: number;
      price: string;
      value: number;
    }[];
  };
}

export interface Inventory {
  id: number;
  outlet_id: number;
  product_id: number;
  quantity: number;
  min_stock: number;
  created_at: Date;
  updated_at: Date;
  last_stock: LastStock | null;
  product: Product;
}

export interface LastStock {
  id: number;
  outlet_id: number;
  product_id: number;
  quantity_before: number;
  quantity_after: number;
  quantity_change: number;
  type: string;
  notes: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  quantity: number;
  min_stock: number;
}


export interface DashboardReportResponse extends StatusMessage {
  data: {
    date:                 Date;
    outlet:               string;
    summary:              Summary;
    hourly_sales:         HourlySales[];
    category_sales:       CategorySale[];
    payment_method_sales: PaymentMethodSales;
  }
}

export interface CategorySale {
  name:           string;
  total_quantity: string;
  total_sales:    string;
}

export interface HourlySales {
  [hour: string]: HourlySale;
}

export interface HourlySale {
  orders: number;
  sales:  number;
}

export interface PaymentMethodSales {
  cash: Cash;
  qris: Cash;
}

export interface Cash {
  count: number;
  total: number;
}

export interface Summary {
  total_sales:         number;
  total_orders:        number;
  total_items:         string;
  average_order_value: number;
}
