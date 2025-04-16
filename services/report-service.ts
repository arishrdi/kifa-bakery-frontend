// import { createQueryHook } from "@/lib/query-hooks";
// import { DashboardResponse } from "@/types/dashboard";
// import { DashboardReportResponse, GetInventoryByDateResponse, RealtimeStockResponse } from "@/types/report";

// export const getRealtimeStock = (outletId: number) => {
//   return createQueryHook<RealtimeStockResponse>(`/inventory-histories/stock/${outletId}`, ['realtime-stock']);
// };

// export const getInventoryByDate = (outletId: number, date: string) => {
//   return createQueryHook<GetInventoryByDateResponse>(`/reports/inventory-by-date/${outletId}?date=${date}`, ['inventory-by-date', date, outletId.toString()])();
// };


// export const getDashboardReport = (outletId: number) => {
//   return createQueryHook<DashboardResponse>(`/reports/dashboard-summary/${outletId}`, ['dashboard-report', outletId.toString()])();
// };

import { createQueryHook } from "@/lib/query-hooks";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { QueryFunction } from "@tanstack/react-query"
import { getAuthToken } from '@/services/auth-service';
import { DashboardResponse } from "@/types/dashboard";
import {  GetInventoryByDateResponse, RealtimeStockResponse, SalesDataDaily } from "@/types/report";
import { getCookie } from "cookies-next";

interface DashboardReportResponse {
  outlet: string
  cash: string
  period: {
    start_date: string
    end_date: string
  }
  summary: {
    total_sales: number
    total_orders: number
    total_items: string
    average_order_value: number
  }
  sales: {
    current_period: number
    previous_period: number
    change_percentage: number
    this_month: string
    last_month: number
    monthly_change_percentage: number
  }
  daily_sales: {
    [key: string]: {
      orders: number
      sales: number
      items: number
      average_order: number
    }
  }
  category_sales: Array<{
    name: string
    total_quantity: string
    total_sales: string
  }>
  payment_method_sales: {
    cash: {
      count: number
      total: number
    }
    qris: {
      count: number
      total: number
    }
  }
  top_products: Array<{
    name: string
    quantity: string
    total: string
  }>
  low_stock_items: Array<{
    product_name: string
    quantity: number
    min_stock: number
  }>
  active_shift: {
    cashier: string
    started_at: string
    duration: string
  }
}

interface ProductSales {
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  sales: number;
  order_count: number;
  sales_percentage: number;
}

interface CategorySales {
  category_id: number;
  category_name: string;
  total_quantity: number;
  total_sales: number;
  order_count: number;
  sales_percentage: number;
  products: ProductSales[];
}

export interface SalesByCategoryResponse {
  status: boolean;
  data: {
    date_range: {
      start_date: string;
      end_date: string;
    };
    outlet: string;
    summary: {
      total_categories: number;
      total_products: number;
      total_quantity: number;
      total_sales: number;
      total_orders: number;
    };
    categories: CategorySales[];
  };
}

interface DailySalesResponse {
  status: boolean;
  data: {
    date: string;
    outlet: string;
    summary: {
      total_sales: number;
      total_orders: number;
      total_items: number;
      average_order_value: number;
    };
    hourly_sales: Record<string, {
      orders: number;
      sales: number;
    }>;
    category_sales: Array<{
      name: string;
      total_quantity: number;
      total_sales: number;
    }>;
    payment_method_sales: Record<string, {
      count: number;
      total: number;
    }>;
    orders: Array<{
      order_id: number;
      order_time: string;
      total: number;
      payment_method: string;
      cashier: string;
      items: Array<{
        product_id: number;
        product_name: string;
        category: string;
        sku: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
      }>;
    }>;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const token = getCookie("access_token");

const fetchApi: QueryFunction = async ({ queryKey }) => {
  const [url] = queryKey;
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getRealtimeStock = (outletId: number) => {
  return createQueryHook<RealtimeStockResponse>(`/inventory-histories/stock/${outletId}`, ['realtime-stock']);
};

export const getInventoryByDate = (outletId: number, date: string) => {
  return createQueryHook<GetInventoryByDateResponse>(`/reports/inventory-by-date/${outletId}?date=${date}`, ['inventory-by-date', date, outletId.toString()])();
};

// export const getDashboardReport = (outletId: number) => {
//   return createQueryHook<DashboardReportResponse>(`/reports/daily-sales/${outletId}`, ['dashboard-report', outletId.toString()])();
// };

// export const getDashboardReport = (outletId: number) => {
//   return createQueryHook<DashboardResponse>(`/reports/dashboard-summary/${outletId}`, ['dashboard-report', outletId.toString()])();
// };

export const getDashboardReport = (outletId: number, dateRange?: DateRange) => {
  const params = new URLSearchParams();
  
  if (dateRange?.from) {
    params.append('start_date', dateRange.from.toISOString().split('T')[0]);
  }
  if (dateRange?.to) {
    params.append('end_date', dateRange.to.toISOString().split('T')[0]);
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  return createQueryHook<DashboardReportResponse>(
    `/reports/dashboard-summary/${outletId}${queryString}`, 
    ['dashboard-report', outletId.toString(), dateRange?.from?.toString(), dateRange?.to?.toString()]
  )();
};

const fetchTopProducts = async (dateRange: DateRange) => {
  if (!dateRange.from || !dateRange.to) return;

  const params = new URLSearchParams({
    start_date: format(dateRange.from, 'yyyy-MM-dd'),
    end_date: format(dateRange.to, 'yyyy-MM-dd'),
    outlet_id: selectedOutletId
  });

  try {
    const response = await fetch(`/api/reports/top-products?${params}`);
    const data = await response.json();
    // Update state produk terlaris dengan data baru
    setTopProductsData(data);
  } catch (error) {
    console.error('Error fetching top products:', error);
  }
};

export const getSalesByCategory = (outletId: number, dateRange: DateRange) => {
  const params = new URLSearchParams();
  
  if (dateRange?.from) {
    params.append('start_date', format(dateRange.from, 'yyyy-MM-dd'));
  }
  if (dateRange?.to) {
    params.append('end_date', format(dateRange.to, 'yyyy-MM-dd'));
  }
  
  const url = `/reports/sales-by-category/${outletId}?${params.toString()}`;
  
  return {
    queryKey: ['sales-by-category', outletId, dateRange?.from?.toString(), dateRange?.to?.toString()],
    queryFn: () => fetchApi({ queryKey: [url] }) as Promise<SalesByCategoryResponse>,
  };
};


// export const getSalesDaily = (outletId: number, date: string) => {
//   return createQueryHook<SalesDataDaily>(`/reports/daily-sales/${outletId}`, ['daily-sales', outletId.toString()])();
// };

export const getSalesDaily = (outletId: number) => ({
  queryKey: ['daily-sales', outletId.toString()],
  queryFn: async () => {
    const response = await fetch(`${BASE_URL}/reports/daily-sales/${outletId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
});

