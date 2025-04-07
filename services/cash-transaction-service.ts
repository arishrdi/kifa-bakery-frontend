import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { CashBalanceResponse, CashInput, CashTransactionResponse } from "@/types/cash";

export const getCashBalanceByOutlet = (id: number) => {
    return createQueryHook<CashBalanceResponse>(`/cash-registers/${id}`, ['cash-register', id.toString()]);
};

export const addCashTransaction = createMutationHook<CashInput, CashTransactionResponse>('/cash-register-transactions/add-cash', 'post');

export const subtractCashTransaction = createMutationHook<CashInput, CashTransactionResponse>('/cash-register-transactions/subtract-cash', 'post');


