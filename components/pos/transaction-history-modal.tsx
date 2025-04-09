"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarIcon, FileText, Search } from "lucide-react"
import { getHistoryOrders } from "@/services/order-service"
import { useAuth } from "@/contexts/auth-context"
import { PrintInvoice } from "./print-invoice"

interface TransactionHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionHistoryModal({ open, onOpenChange }: TransactionHistoryModalProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  const { user } = useAuth()
  const orderHistory = getHistoryOrders(user?.outlet_id, format(date, 'yyyy-MM-dd'),format(date, 'yyyy-MM-dd'), 100, 'completed')

  const { data: transactionData } = orderHistory()
  const [showInvoice, setShowInvoice] = useState(false);


  console.log(transactionData?.data.orders.data)
  // Filter transactions based on date and search query
  const filteredTransactions = transactionData?.data.orders.data.filter((transaction) => {
    const matchesDate = transaction.created_at === format(date, "yyyy-MM-dd")
    const matchesSearch =
      transaction.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.payment_method.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesDate && (searchQuery === "" || matchesSearch)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Riwayat Transaksi</DialogTitle>
          <DialogDescription>Lihat riwayat transaksi berdasarkan tanggal</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex flex-1 gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal border-orange-200",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
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
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari transaksi..."
              className="pl-8 border-orange-200 w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md bg-orange-50 p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Total Transaksi {format(date, "d MMMM yyyy", { locale: id })}</p>
              <p className="text-sm text-muted-foreground">{transactionData?.data.total_orders} transaksi</p>
            </div>
            <div className="text-xl font-bold text-orange-600">Rp {Number(transactionData?.data.total_revenue).toLocaleString()}</div>
          </div>
        </div>

        <div className="border rounded-md max-h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Kasir</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {filteredTransactions?.map((transaction) => ( */}
              {transactionData?.data.orders.data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.order_number}</TableCell>
                  <TableCell>{transaction.created_at}</TableCell>
                  <TableCell>{transaction.user}</TableCell>
                  <TableCell>{transaction.items.length} item</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        transaction.payment_method === "cash"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {transaction.payment_method === "cash" ? "Tunai" : "QRIS"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">Rp {Number(transaction.total).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => PrintInvoice({ cashierName: user?.name || "Kasir", order: transaction })} >
                      <FileText className="h-4 w-4 text-orange-500" />
                      {/* {showInvoice && <PrintInvoice cashierName={user?.name || "Kasir"}  order={transaction}/>} */}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* {filteredTransactions?.length === 0 && ( */}
              {transactionData?.data.orders.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada transaksi pada tanggal ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" className="border-orange-200" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

