import { User } from "./auth";
import { StatusMessage } from "./response";
import { Shift } from "./shift";

export interface CashBalanceResponse extends StatusMessage {
    data: CashBalance;
}

export interface CashTransactionResponse extends StatusMessage {
    data: CashTransaction;
}

export interface CashInput {
    outlet_id: number;
    amount: number;
    reason?: string;
}

export interface CashTransaction {
    shift_id:         number;
    user_id:          number;
    type:             "add" | "remove";
    amount:           string;
    reason:           string;
    cash_register_id: number;
    updated_at:       Date;
    created_at:       Date;
    id:               number;
}

export interface CashBalance {
    id:         number;
    outlet_id:  number;
    is_active:  number;
    balance:    string;
    created_at: Date;
    updated_at: Date;
}

export interface CashHistoryResponse extends StatusMessage {
    data: FullCashTransaction[]
}

export interface FullCashTransaction extends CashTransaction {
    source: string;
    cash_register: CashBalance;
    shift: Shift;
    user: User;
    amount: string; // override dari number jadi string jika perlu untuk raw API
    created_at: Date;
    updated_at: Date;
  }

// const interface CashHistoryResponse extends 
