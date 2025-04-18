"use client"

import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { StockStatus } from "@/components/dashboard/stock-status"
import { ShiftOverview } from "@/components/dashboard/shift-overview"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Store } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getDashboardReport } from "@/services/report-service"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useState } from "react"
import { startOfMonth, endOfDay } from "date-fns"

export default function DashboardPage() {
  const { currentOutlet, isLoading } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "overview"

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  })


  // const tab = searchParams.get("tab") || "overview"
  const { data: dashboardReport, isLoading: isLoadingDashboardReport } = getDashboardReport(
    currentOutlet?.id || 1,
    dateRange
  )


  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        {currentOutlet && (
          <Alert className="flex flex-row items-center">
            <div className="flex gap-2">
              <Store className="h-4 w-4" />
              <div>

              <AlertTitle>Outlet Aktif: {currentOutlet.name}</AlertTitle>
              <AlertDescription>Data yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
              </div>
            </div>

            <div className="ml-auto">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {(dashboardReport?.data.summary.total_sales)?.toLocaleString()}</div>
              {/* <p className="text-xs text-muted-foreground">
                {dashboardReport?.data.sales.change_percentage > 0 ? "+" : ""}
                {dashboardReport?.data.sales.change_percentage}% dari periode sebelumnya
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaksi</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardReport?.data.summary.total_orders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Item Terjual</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardReport?.data.summary.total_items || 0} Item</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total kas Kasir</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {parseInt(dashboardReport?.data.cash ?? "0").toLocaleString() || 0}</div>
            </CardContent>
          </Card>
        </div>

        {tab === "overview" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  {currentOutlet && <CardDescription>Data penjualan untuk {currentOutlet.name}</CardDescription>}
                </CardHeader>
                <CardContent className="pl-2">
                  {dashboardReport?.data.daily_sales && (
                    <Overview data={dashboardReport.data.daily_sales} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Penjualan Terlaris</CardTitle>

                  <CardDescription>
                    {dashboardReport?.data.top_products.length || 0} produk terlaris
                  </CardDescription>

                </CardHeader>
                <CardContent>
                  <RecentSales products={dashboardReport?.data.top_products || []} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

