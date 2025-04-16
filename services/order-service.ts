import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { OrderInput, OrderResponse } from "@/types/order";
import { OrderHistoryInput, OrderHistoryResponse } from "@/types/order-history";

export const createOrder = createMutationHook<OrderInput, OrderResponse>('/orders', 'post');


// export const getHistoryOrders = (outlet_id?: number, date_from?: string, date_to?: string, per_page?: number, status?: string) => {
//   return createQueryHook<OrderHistoryResponse>(
//       `/orders/history?outlet_id=${outlet_id}&date_from=${date_from}&date_to=${date_to}&per_page=${per_page}&status=${status}`,
//       ['orders-history', outlet_id?.toString() || '', date_from, date_to, per_page, status]
//   );
// };
export const getHistoryOrders = (outlet_id?: number, date_from?: string, date_to?: string, per_page?: number, status?: string) => {
  return createQueryHook<OrderHistoryResponse>(
      `/orders/history?outlet_id=${outlet_id}&date_from=${date_from}&date_to=${date_to}`,
      ['orders-history', outlet_id?.toString() || '', date_from, date_to]
  );
};

// export const cancelOrder = createMutationHook<number, void>('/orders', 'delete');

export const cancelOrder = () => {
    return createMutationHook<number, void, void>(
      (id) => `/orders/cancel/${id}`, 
      'post'
    )();
  };
