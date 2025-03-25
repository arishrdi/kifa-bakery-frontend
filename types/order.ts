import { StatusMessage } from "./response";

export interface OrderInput {
  outlet_id: number;
  shift_id: number;
  payment_method: string;
  total_paid: number;
  tax: number;
  items: Item[];
}

export interface Item {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderResponse extends StatusMessage {
  data: Order[];
}

export interface Order {
  order_number: string;
  outlet_id: number;
  user_id: number;
  shift_id: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  total_paid: number;
  change: number;
  payment_method: string;
  status: string;
  notes: null;
  updated_at: Date;
  created_at: Date;
  id: number;

}
