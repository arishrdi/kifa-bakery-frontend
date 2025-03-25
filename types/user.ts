import { StatusMessage } from "./response";

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role: "admin" | "kasir";
  toko_id: number;
}

export interface UserResponse extends StatusMessage {
  data: UserData;
}

export interface UsersResponse extends StatusMessage {
  data: UserData[];
}

export interface UserData {
  name: string;
  email: string;
  role: string;
  toko_id: number;
  updated_at: Date;
  created_at: Date;
  id: number;
}

