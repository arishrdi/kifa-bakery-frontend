import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { OrderInput, OrderResponse, RevenueResponse } from "@/types/order";
import { OrderHistoryInput, OrderHistoryResponse } from "@/types/order-history";

export const createOrder = createMutationHook<OrderInput, OrderResponse>('/orders', 'post');

const addParamIfExists = (params: URLSearchParams, key: string, value?: string | number) => {
  if (value !== undefined && value !== null && value !== '') {
    params.append(key, value.toString());
  }
};

export const getHistoryOrders = (
  outlet_id?: number,
  date_from?: string,
  date_to?: string,
  member_id?: string
) => {
  const params = new URLSearchParams();

  addParamIfExists(params, 'outlet_id', outlet_id);
  addParamIfExists(params, 'date_from', date_from);
  addParamIfExists(params, 'date_to', date_to);
  addParamIfExists(params, 'member_id', member_id);

  return createQueryHook<OrderHistoryResponse>(
    `/orders/history?${params.toString()}`,
    ['orders-history', outlet_id, date_from, date_to, member_id]
  );
};

export const getOneMonthRevenue = (outletId: number) => {
  return createQueryHook<RevenueResponse>(`/orders/revenue/${outletId}`, ['revenue', outletId.toString()])()
}

export const cancelOrder = () => {
  return createMutationHook<number, void, void>(
    (id) => `/orders/cancel/${id}`,
    'post'
  )();
};
