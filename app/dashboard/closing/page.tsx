"use client"

import { useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, CheckCircle, Clock, FileText, Lock, Search, Store, TicketX } from "lucide-react"
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
import { getCashHistory, getCashHistoryPOS } from "@/services/cash-transaction-service"
import { cancelOrder, getHistoryOrders } from "@/services/order-service"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import TransactionDetailDialog from "@/components/transaction-detail-dialog"

export default function ClosingPage() {
  const { currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "today"

  const [date, setDate] = useState<Date>(new Date())
  const query = getCashHistory(currentOutlet?.id ?? 0, format(date, 'yyyy-MM-dd'))
  const { data } = query()

  const [selectedInvoice, setSelectedInvoice] = useState("")
  const [searchQuery, setSearchQuery] = useState("")


  const orderHistory = getHistoryOrders(currentOutlet?.id, format(date, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'))

  const { data: transactionData, refetch: refetchOrder } = orderHistory()

  const cancelOrderMutate = cancelOrder()

  const handleCancelOrder = (id: number) => {
    cancelOrderMutate.mutate(id, {
      onSuccess: () => {
        refetchOrder()
        // setRefundPopover(false)
        toast({ description: "Berhasil melakukan refund" })
      }
    })
  }

  const filteredTransactions = transactionData?.data.orders.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.order_number.toLowerCase().includes(searchLower) ||
      transaction.user.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="flex flex-col space-y-4">

      {currentOutlet && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>Outlet Aktif: {currentOutlet.name}</AlertTitle>
          <AlertDescription>Data closing yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
        </Alert>
      )}

      {tab === "history-order" && (
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>Lihat riwayat transaksi</CardDescription>
            </div>
            <div className="ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMMM yyyy", { locale: id }) : <span>Pilih bulan</span>}
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
          <CardContent className="space-y-4">

            <div className="">
              <div className="">
                <div className="flex justify-between">
                  {/* <h3 className="font-semibold">Ringkasan Transaksi</h3> */}
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari transaksi berdasarkan invoice..."
                      className="pl-8  w-full sm:w-[400px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-semibold text-gray-700">Invoice</TableHead>
                    <TableHead className="text-sm font-semibold text-gray-700">Waktu</TableHead>
                    <TableHead className="text-sm font-semibold text-gray-700">Kasir</TableHead>
                    <TableHead className="text-sm font-semibold text-gray-700">Pembayaran</TableHead>
                    <TableHead className="text-sm font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-sm font-semibold text-gray-700 text-right">Total</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>

                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-sm text-gray-500">
                        {searchQuery ? "Tidak ada transaksi yang cocok." : "Tidak ada transaksi pada tanggal ini."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="text-sm text-gray-800 font-medium">{transaction.order_number}</TableCell>
                        <TableCell className="text-sm text-gray-600">{transaction.created_at}</TableCell>
                        <TableCell className="text-sm text-gray-600">{transaction.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-1 rounded-full ${transaction.payment_method === "cash"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : transaction.payment_method === "qris"
                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                : "bg-purple-100 text-purple-800 border-purple-200"
                              }`}
                          >
                            {transaction.payment_method === "cash"
                              ? "Tunai"
                              : transaction.payment_method === "qris"
                                ? "QRIS"
                                : "TRANSFER"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {transaction.status === 'completed' ? (
                            <span className="text-green-600 font-medium">Selesai</span>
                          ) : (
                            <span className="text-red-500 font-medium">Dibatalkan</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm font-semibold text-gray-800">
                          Rp {Number(transaction.total).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">

                            <TransactionDetailDialog trx={transaction} />

                            {transaction.status === 'completed' && (
                              <Popover
                                open={selectedInvoice === transaction.order_number}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setSelectedInvoice(transaction.order_number)
                                  } else {
                                    setSelectedInvoice("")
                                  }
                                }}
                                modal
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <TicketX className="h-4 w-4 text-red-500" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-72 p-4 rounded-md shadow-lg border border-gray-200 bg-white"
                                  align="end"
                                  sideOffset={8}
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900">Refund Transaksi?</h4>
                                      <p className="text-xs text-gray-500">Invoice: {selectedInvoice}</p>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        size="sm"
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => handleCancelOrder(transaction.id)}
                                      >
                                        Refund
                                      </Button>

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedInvoice('')}
                                      >
                                        Batal
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}

                            {/* <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            if (user?.outlet) {
                              handlePrintReceipt(transaction, user.outlet)
                            }
                          }}
                          title="Cetak struk"
                        >
                          <FileText className="h-4 w-4 text-orange-500" />
                        </Button> */}

                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
                    {date ? format(date, "dd MMMM yyyy", { locale: id }) : <span>Pilih bulan</span>}
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
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((orderHistory) => (
                    <TableRow key={`shift-${orderHistory.id}`}>
                      <TableCell className="font-medium">{orderHistory.user.name}</TableCell>
                      {/* <TableCell>{orderHistory.created_at.toLocaleDateString('id-ID')}</TableCell> */}
                      <TableCell>{new Date(orderHistory.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        {orderHistory.type === "add" && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            + Penambahan
                          </Badge>
                        )}
                        {orderHistory.type === "remove" && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-blue-100"
                          >
                            - Pengurangan
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell >{orderHistory.reason}</TableCell>
                      <TableCell className="text-right">
                        Rp. {parseInt(orderHistory.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

