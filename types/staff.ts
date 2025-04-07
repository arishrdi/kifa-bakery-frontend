import { Outlet } from "./outlet";
import { StatusMessage } from "./response";
import { Shift } from "./shift";

export interface StaffAllResponse extends StatusMessage {
  data: StaffDetail[];
}

export interface StaffResponse extends StatusMessage {
  data: Staff;
}

export interface StaffInput {
  name: string;
  email: string;
  password: string;
  outlet_id?: number;
  role: string;
  start_time?: string;
  end_time?: string;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  password: string;
  outlet_id: number;
  role: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface StaffDetail {
  id:                number;
  name:              string;
  email:             string;
  email_verified_at: Date | null;
  role:              string;
  outlet_id:         number;
  is_active:         boolean;
  created_at:        Date;
  updated_at:        Date;
  outlet:            Outlet;
  last_shift:        Shift;
}

// export interface LastShift {
//   id:         number;
//   outlet_id:  number;
//   user_id:    number;
//   start_time: string;
//   end_time:   string;
//   created_at: Date;
//   updated_at: Date;
// }

// export interface Outlet {
//   id:         number;
//   name:       string;
//   address:    string;
//   phone:      string;
//   qris:       null;
//   tax:        string;
//   email:      string;
//   is_active:  boolean;
//   created_at: Date;
//   updated_at: Date;
// }