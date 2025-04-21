import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '../ui/button'
import { CalendarDays } from 'lucide-react'
import { RevenueResponse } from '@/types/order'

export default function MonthlyRevenue({ revenue }: { revenue: RevenueResponse["data"] }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="border-orange-200 bg-orange-50 hover:bg-orange-100">
          <CalendarDays className="mr-2 h-4 w-4 text-orange-500" />
          <span className="font-medium">Rp {Number(revenue.total).toLocaleString() || 0}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div>
          <p className="text-muted-foreground text-sm mt-1">
            Total pendapatan dari {" "}
            <span className="font-semibold underline-offset-4 text-black/70 underline">
              {revenue.from}
            </span>{" "}
            sampai {" "}
            <span className="font-semibold underline-offset-4 text-black/70 underline">
              {revenue.to}
            </span>
          </p>
          {/* <p className="text-muted-foreground text-xs">Total pendapatan dari {oneMonthRevenue?.data.from} sampai {oneMonthRevenue?.data.to}</p> */}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
