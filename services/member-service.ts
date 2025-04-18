import { createMutationHook, createQueryHook } from "@/lib/query-hooks";
import { AllMemberResponse, MemberInput, MemberResponse } from "@/types/member";

export const getAllMembers = createQueryHook<AllMemberResponse>('/members', ['members']);

export const createMember = createMutationHook<MemberInput, MemberResponse>('/members', 'post');

export const updateMember = (id: number) => {
    return createMutationHook<MemberInput, MemberResponse>(`/members/${id}`, "put")();
};

export const deleteMember = () => {
    return createMutationHook<number, void, void>(
        (id) => `/members/${id}`,
        'delete'
    )();
};

