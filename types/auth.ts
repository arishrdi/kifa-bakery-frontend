import { Outlet } from "./outlet";
import { StatusMessage } from "./response";
import { Shift } from "./shift";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "supervisor";
  outlet_id: number
  outlet: Outlet
  last_shift: Shift
  
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse extends StatusMessage {
  data: {
    user: User,
    token: string
  }
}

export interface ProfileResponse extends StatusMessage {
  data: User
}

export interface LogoutResponse {
  message: string
  status: string
}
