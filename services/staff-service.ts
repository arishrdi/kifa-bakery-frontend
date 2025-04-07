import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { StaffAllResponse, StaffInput, StaffResponse } from "@/types/staff";

export const getAllStaffByOutlet = (id: number) => {
    return createQueryHook<StaffAllResponse>(`/user/all/${id}`, ['staffs-outlet', id.toString()]);
};

export const createStaff = createMutationHook<StaffInput, StaffResponse>('/user/register', 'post');

export const updateStaff = createMutationHook<StaffInput, StaffResponse>('/user/update', 'put');

export const deleteStaff = createMutationHook<number, void>('/user/delete', 'delete');