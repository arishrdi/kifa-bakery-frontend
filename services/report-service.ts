import { createQueryHook } from "@/lib/query-hooks";
import { DashboardReportResponse, GetInventoryByDateResponse, RealtimeStockResponse } from "@/types/report";

export const getRealtimeStock = (outletId: number) => {
  return createQueryHook<RealtimeStockResponse>(`/inventory-histories/stock/${outletId}`, ['realtime-stock']);
};

export const getInventoryByDate = (outletId: number, date: string) => {
  return createQueryHook<GetInventoryByDateResponse>(`/reports/inventory-by-date/${outletId}?date=${date}`, ['inventory-by-date', date, outletId.toString()])();
};

export const getDashboardReport = (outletId: number) => {
  return createQueryHook<DashboardReportResponse>(`/reports/daily-sales/${outletId}`, ['dashboard-report', outletId.toString()])();
};

