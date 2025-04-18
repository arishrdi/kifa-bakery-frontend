import { StatusMessage } from "./response"

export interface Member {
    id: number,
    name: string
    email?: string
    phone?: string
    address?: string
    gender?: "male" | "female"
    created_at: Date;
    updated_at: Date;
}

export interface MemberInput extends Omit<Member, "id" | "created_at" | "updated_at"> { }

export interface AllMemberResponse extends StatusMessage {
  data: Member[];
}

export interface MemberResponse extends StatusMessage {
  data: Member;
}
