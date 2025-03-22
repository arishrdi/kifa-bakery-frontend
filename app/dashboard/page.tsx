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

export default function DashboardPage() {
  const { currentOutlet, isLoading } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "overview"
  // const tab = searchParams.get("tab") || "overview"

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        {currentOutlet && (
          <Alert>
            <Store className="h-4 w-4" />
            <AlertTitle>Outlet Aktif: {currentOutlet.name}</AlertTitle>
            <AlertDescription>Data yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penjualan Hari Ini</CardTitle>
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
              <div className="text-2xl font-bold">Rp 5.231.000</div>
              <p className="text-xs text-muted-foreground">+20.1% dari kemarin</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaksi Hari Ini</CardTitle>
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
              <div className="text-2xl font-bold">+128</div>
              <p className="text-xs text-muted-foreground">+14% dari kemarin</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
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
              <div className="text-2xl font-bold">5 item</div>
              <p className="text-xs text-muted-foreground">Perlu restock segera</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shift Aktif</CardTitle>
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
              <div className="text-2xl font-bold">Siang</div>
              <p className="text-xs text-muted-foreground">14:00 - 22:00</p>
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
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Penjualan Terbaru</CardTitle>
                  <CardDescription>Anda memiliki 128 transaksi hari ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {tab === "stock" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status Stok</CardTitle>
                {currentOutlet && <CardDescription>Status stok real-time untuk {currentOutlet.name}</CardDescription>}
              </CardHeader>
              <CardContent>
                <StockStatus />
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "shifts" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Shift</CardTitle>
                {currentOutlet && (
                  <CardDescription>Performa penjualan per shift untuk {currentOutlet.name}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ShiftOverview />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

