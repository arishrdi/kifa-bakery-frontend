import MemberDetail from '@/components/user/member'
import React from 'react'

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <MemberDetail id={id} />
    )
}
