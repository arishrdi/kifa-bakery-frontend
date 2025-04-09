"use client"

import { useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, CheckCircle, Clock, FileText, Lock, Store } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"

const closingData = [
  {
    id: 1,
    date: "2023-03-19",
    status: "closed",
    closedBy: "Admin",
    closedAt: "23:45",
    totalSales: 6400000,
    totalTransactions: 128,
    notes: "Semua transaksi selesai dengan baik",
  },
  {
    id: 2,
    date: "2023-03-18",
    status: "closed",
    closedBy: "Supervisor",
    closedAt: "23:50",
    totalSales: 5800000,
    totalTransactions: 115,
    notes: "Ada selisih kas sebesar Rp 50.000",
  },
  {
    id: 3,
    date: "2023-03-17",
    status: "closed",
    closedBy: "Admin",
    closedAt: "23:55",
    totalSales: 6100000,
    totalTransactions: 122,
    notes: "Semua transaksi selesai dengan baik",
  },
]

const todayClosingData = {
  date: "2023-03-20",
  status: "open",
  shifts: [
    {
      name: "Pagi",
      time: "06:00 - 14:00",
      status: "closed",
      sales: 2250000,
      transactions: 45,
    },
    {
      name: "Siang",
      time: "14:00 - 22:00",
      status: "active",
      sales: 1600000,
      transactions: 32,
    },
    {
      name: "Malam",
      time: "22:00 - 06:00",
      status: "upcoming",
      sales: 0,
      transactions: 0,
    },
  ],
  totalSales: 3850000,
  totalTransactions: 77,
  cashOnHand: 3850000,
  expectedCash: 3850000,
  difference: 0,
}

export default function ClosingPage() {
  const { currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "today"

  const [date, setDate] = useState<Date>(new Date())
  const [isClosingDialogOpen, setIsClosingDialogOpen] = useState(false)
  const [closingNotes, setClosingNotes] = useState("")

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sistem Closing</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isClosingDialogOpen} onOpenChange={setIsClosingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Lock className="mr-2 h-4 w-4" /> Closing Hari Ini
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Konfirmasi Closing Hari Ini</DialogTitle>
                <DialogDescription>
                  Pastikan semua transaksi sudah selesai. Setelah closing, data tidak dapat diubah.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tanggal:</span>
                    <span>{format(new Date(), "PPP", { locale: id })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Transaksi:</span>
                    <span>{todayClosingData.totalTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Penjualan:</span>
                    <span>Rp {todayClosingData.totalSales.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Kas yang Diharapkan:</span>
                    <span>Rp {todayClosingData.expectedCash.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Kas Aktual:</span>
                    <span>Rp {todayClosingData.cashOnHand.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Selisih:</span>
                    <span className={todayClosingData.difference === 0 ? "text-green-600" : "text-red-600"}>
                      Rp {todayClosingData.difference.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Catatan Closing
                  </label>
                  <textarea
                    id="notes"
                    className="w-full rounded-md border p-2"
                    rows={3}
                    placeholder="Tambahkan catatan closing di sini..."
                    value={closingNotes}
                    onChange={(e) => setClosingNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsClosingDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsClosingDialogOpen(false)}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Konfirmasi Closing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {currentOutlet && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>Outlet Aktif: {currentOutlet.name}</AlertTitle>
          <AlertDescription>Data closing yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
        </Alert>
      )}

      {tab === "today" && (
        <Card>
          <CardHeader>
            <CardTitle>Status Closing Hari Ini</CardTitle>
            <CardDescription>{format(new Date(), "PPP", { locale: id })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md bg-muted p-4">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Status Closing</p>
                  <p className="text-sm text-muted-foreground">
                    {todayClosingData.status === "open" ? "Belum Closing" : "Sudah Closing"}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  todayClosingData.status === "open"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                }
              >
                {todayClosingData.status === "open" ? "Terbuka" : "Tertutup"}
              </Badge>
            </div>

            <div className="rounded-md border">
              <div className="p-4">
                <h3 className="font-semibold">Ringkasan Shift</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shift</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Transaksi</TableHead>
                    <TableHead className="text-right">Penjualan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayClosingData.shifts.map((shift, index) => (
                    <TableRow key={`shift-${index}`}>
                      <TableCell className="font-medium">{shift.name}</TableCell>
                      <TableCell>{shift.time}</TableCell>
                      <TableCell>
                        {shift.status === "active" && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Aktif
                          </Badge>
                        )}
                        {shift.status === "closed" && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            Selesai
                          </Badge>
                        )}
                        {shift.status === "upcoming" && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            Akan Datang
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{shift.transactions}</TableCell>
                      <TableCell className="text-right">
                        {shift.sales > 0 ? `Rp ${shift.sales.toLocaleString()}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Penjualan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Transaksi</span>
                      <span className="font-medium">{todayClosingData.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Penjualan</span>
                      <span className="font-medium">Rp {todayClosingData.totalSales.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Kas yang Diharapkan</span>
                      <span className="font-medium">Rp {todayClosingData.expectedCash.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verifikasi Kas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kas yang Diharapkan</span>
                      <span className="font-medium">Rp {todayClosingData.expectedCash.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kas Aktual</span>
                      <span className="font-medium">Rp {todayClosingData.cashOnHand.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Selisih</span>
                      <span
                        className={
                          todayClosingData.difference === 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
                        }
                      >
                        Rp {todayClosingData.difference.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "history" && (
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Riwayat Kas</CardTitle>
              <CardDescription>Lihat riwayat kas</CardDescription>
            </div>
            <div className="ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMMM yyyy", { locale: id }) : <span>Pilih bulan</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ditutup Oleh</TableHead>
                  <TableHead>Waktu Closing</TableHead>
                  <TableHead className="text-right">Transaksi</TableHead>
                  <TableHead className="text-right">Total Penjualan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closingData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.status === "closed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }
                      >
                        {item.status === "closed" ? "Tertutup" : "Terbuka"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.closedBy}</TableCell>
                    <TableCell>{item.closedAt}</TableCell>
                    <TableCell className="text-right">{item.totalTransactions}</TableCell>
                    <TableCell className="text-right">Rp {item.totalSales.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Laporan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

