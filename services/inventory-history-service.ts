import  apiClient from "@/lib/api-client"

export const getPendingStockAdjustments = async (outletId: number) => {
  const response = await apiClient.get(`/inventory-histories/outlet/${outletId}?status=pending`)
  return response.data
}

export const approveStockAdjustment = async (id: number, approve = true) => {
  const response = await apiClient.post(`/inventory-histories/approval`, {
    inventory_history_id: id,
    approve
  })
  return response.data
}