import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { CashBalanceResponse, CashHistoryResponse, CashInput, CashTransactionResponse } from "@/types/cash";

export const getCashBalanceByOutlet = (id: number) => {
    return createQueryHook<CashBalanceResponse>(`/cash-registers/${id}`, ['cash-register', id.toString()]);
};

export const addCashTransaction = createMutationHook<CashInput, CashTransactionResponse>('/cash-register-transactions/add-cash', 'post');

export const subtractCashTransaction = createMutationHook<CashInput, CashTransactionResponse>('/cash-register-transactions/subtract-cash', 'post');

export const getCashHistory = (id: number, date: string) => {
    return createQueryHook<CashHistoryResponse>(`/cash-register-transactions?source=cash&outlet_id=${id}&date=${date}`, ['cash-history', id.toString(), date]);
};

export const getCashHistoryPOS = (id: number) => {
    return createQueryHook<CashHistoryResponse>(`/cash-register-transactions?source=pos&outlet_id=${id}`, ['cash-history-pos', id.toString()]);
};
