import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { Inventory, InventoryApprovalInput, InventoryHistoryByOutletResponse, InventoryInput, InventoryResponse } from "@/types/inventory";

export const createInventoryHistory = createMutationHook<InventoryInput, InventoryResponse>('/inventory-histories', 'post');

export const updateInventory = createMutationHook<Inventory, InventoryResponse>('/inventory', 'put');

export const deleteInventory = createMutationHook<Inventory, InventoryResponse>('/inventory', 'delete');

export const useInventoryHistoryByOutlet = (outlet_id: number, date: string) => createQueryHook<InventoryHistoryByOutletResponse>(`/inventory-histories/outlet/${outlet_id}?date=${date}`, ['inventory-histories-outlet', outlet_id.toString(), date])();

export const createInventoryCashier = createMutationHook<InventoryInput, InventoryResponse>('/adjust-inventory', 'post');
export const adminApproveInventory = createMutationHook<InventoryApprovalInput, InventoryResponse>('/inventory-histories/approval', 'post');
export const adminRejectInventory = createMutationHook<InventoryApprovalInput, InventoryResponse>('/inventory-histories/reject', 'post');

export const getInventoryHistoriesCashier = (outlet_id: number, date: string) => {
    return createQueryHook<InventoryHistoryByOutletResponse>(`/adjust-inventory/${outlet_id}?date=${date}`, ['inventory-cashier', outlet_id.toString(), date])();
};