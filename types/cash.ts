import { StatusMessage } from "./response";

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
    type:             string;
    amount:           number;
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


