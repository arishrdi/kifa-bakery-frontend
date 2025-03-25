import { StatusMessage } from "./response";

export interface AllOutletsResponse extends StatusMessage {
  data: Outlet[];
}

export interface OutletResponse extends StatusMessage {
  data: Outlet;
}

export interface Outlet {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: null;
  updated_at: null;
}

export interface OutletInput extends Omit<Outlet, "id" | "created_at" | "updated_at"> { }
