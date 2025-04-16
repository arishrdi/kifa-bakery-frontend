export interface DashboardResponse {
    success: boolean;
    message: string;
    data:    Data;
}

export interface Data {
    outlet:               string;
    cash:                 string;
    date:                 Date;
    summary:              Summary;
    sales:                Sales;
    daily_sales:          DailySales;
    category_sales:       CategorySale[];
    payment_method_sales: PaymentMethodSales;
    top_products:         TopProduct[];
    low_stock_items:      LowStockItem[];
    active_shift:         ActiveShift;
}

export interface ActiveShift {
    cashier:    string;
    started_at: string;
    duration:   string;
}

export interface CategorySale {
    name:           string;
    total_quantity: string;
    total_sales:    string;
}

export interface DailySales {
    Minggu: Jumat;
    Senin:  Jumat;
    Selasa: Jumat;
    Rabu:   Jumat;
    Kamis:  Jumat;
    Jumat:  Jumat;
    Sabtu:  Jumat;
}

export interface Jumat {
    orders:        number;
    sales:         number;
    items:         number;
    average_order: number;
    day_number:    number;
}

export interface LowStockItem {
    product_name: string;
    quantity:     number;
    min_stock:    number;
}

export interface PaymentMethodSales {
    cash: Cash;
    qris: Cash;
}

export interface Cash {
    count: number;
    total: number;
}

export interface Sales {
    today:                     number;
    yesterday:                 string;
    change_percentage:         number;
    this_month:                string;
    last_month:                string;
    monthly_change_percentage: number;
}

export interface Summary {
    total_sales:         number;
    total_orders:        number;
    total_items:         string;
    average_order_value: number;
}

export interface TopProduct {
    name:     string;
    quantity: string;
    total:    string;
}
