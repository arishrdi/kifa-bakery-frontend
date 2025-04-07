import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { Inventory, InventoryHistoryByOutletResponse, InventoryInput, InventoryResponse } from "@/types/inventory";

export const createInventoryHistory = createMutationHook<InventoryInput, InventoryResponse>('/inventory-histories', 'post');

export const updateInventory = createMutationHook<Inventory, InventoryResponse>('/inventory', 'put');

export const deleteInventory = createMutationHook<Inventory, InventoryResponse>('/inventory', 'delete');

export const useInventoryHistoryByOutlet = (outlet_id: number, date: string) => createQueryHook<InventoryHistoryByOutletResponse>(`/inventory-histories/outlet/${outlet_id}?date=${date}`, ['inventory-histories-outlet', outlet_id.toString(), date])();

