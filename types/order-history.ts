export interface OrderHistoryResponse {
    success: boolean;
    message: string;
    data:    Data;
}

export interface OrderHistoryInput {
    outlet_id?: number | null; // nullable
    status?: 'pending' | 'completed' | 'canceled' | null; // nullable dan harus salah satu dari nilai yang ditentukan
    date_from?: string | null; // nullable, format tanggal sebagai string
    date_to?: string | null; // nullable, format tanggal sebagai string
    per_page?: number | null; // nullable, integer antara 1 dan 100
    search?: string | null; // nullable, string dengan panjang maksimum 255 karakter
  }

export interface Data {
    total_orders:  number;
    total_revenue: string;
    orders:        Orders;
}

export interface Orders {
    current_page:   number;
    data:           OrderItem[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface OrderItem {
    id:             number;
    order_number:   string;
    outlet:         string;
    user:           string;
    total:          string;

    subtotal:       string
    tax:            string
    discount:       string
    total_paid:     string
    change:         string

    status:         string;
    payment_method: string;
    created_at:     string;
    items:          Item[];
}

export interface Item {
    product:  string;
    quantity: number;
    price:    string;
    total:    number;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
