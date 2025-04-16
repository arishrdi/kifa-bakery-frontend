import { User } from "./auth";
import { Outlet } from "./outlet";
import { Product } from "./product";
import { StatusMessage } from "./response";

export interface InventoryInput {
  outlet_id: number;
  product_id: number;
  quantity_change: number;
  type: "purchase" | "sale" | "adjustment" | "shipment" | "other";
  notes: string;
}

export interface InventoryApprovalInput {
  inventory_history_id: number
}

export interface Inventory {
  outlet_id: number;
  product_id: number;
  quantity_before: number;
  quantity_after: number;
  quantity_change: number;
  type: "purchase" | "sale" | "adjustment" | "shipment" | "other";
  status: "approved" | "pending" | "rejected"
  notes: string;
  user_id: number;
  updated_at: string;
  created_at: string;
  id: number;
}

export interface InventoryHistoryByOutletResponse extends StatusMessage {
  data: InventoryWithRelations[];
}

export type InventoryWithRelations = Inventory & {
  outlet: Outlet;
  product: Product;
  user: User;
};



export interface InventoryResponse extends StatusMessage {
  data: Inventory;
}

export interface InventoryAllHistoryResponse extends StatusMessage {
  data: Inventory[];
}
