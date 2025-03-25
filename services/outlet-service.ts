import { createMutationHook, createQueryHook } from '@/lib/query-hooks';
import { AllOutletsResponse, OutletInput, OutletResponse } from '@/types/outlet';

export const getAllOutlets = createQueryHook<AllOutletsResponse>('/outlets', ['outlets']);

export const createOutlet = createMutationHook<OutletInput, OutletResponse>('/outlets', 'post');

export const updateOutlet = createMutationHook<OutletInput, OutletResponse>('/outlets', 'put');

export const deleteOutlet = createMutationHook<number, void>('/outlets', 'delete');
