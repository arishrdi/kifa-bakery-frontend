"use client"

import { useState } from "react"
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
import { CalendarIcon, FileText, Banknote, Search, TicketX, Printer } from "lucide-react"
import { cancelOrder, getHistoryOrders } from "@/services/order-service"
import { useAuth } from "@/contexts/auth-context"
import { OrderItem } from "@/types/order-history"
import { Outlet } from "@/types/outlet"
import { toast } from "@/hooks/use-toast"
import { printOrders } from "./print-orders"

interface TransactionHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetchBalance: any
}

export function TransactionHistoryModal({ open, onOpenChange, refetchBalance }: TransactionHistoryModalProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  // const [selectedTransaction, setSelectedTransaction] = useState<OrderItem | null>(null)
  // const [refundPopover, setRefundPopover] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState("")

  const { user } = useAuth()
  const orderHistory = getHistoryOrders(user?.outlet_id, format(date, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'))

  const { data: transactionData, refetch: refetchOrder } = orderHistory()

  const filteredTransactions = transactionData?.data.orders.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.order_number.toLowerCase().includes(searchLower) ||
      transaction.user.toLowerCase().includes(searchLower)
    );
  }) || [];

  const cancelOrderMutate = cancelOrder()

  const handleCancelOrder = (id: number) => {
    cancelOrderMutate.mutate(id, {
      onSuccess: () => {
        refetchOrder()
        // setRefundPopover(false)
        refetchBalance()
        toast({ description: "Berhasil melakukan refund" })
      }
    })
  }

  // Function to handle printing the receipt
  const handlePrintReceipt = (transaction: OrderItem, outlet: Outlet) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600')

    if (printWindow) {
      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Struk Transaksi #${transaction.order_number}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 20px;
              max-width: 300px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
            }
            .info {
              font-size: 12px;
              margin: 5px 0;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 5px 0;
            }
            .total {
              font-weight: bold;
              margin-top: 10px;
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
            }
            .logo {
              max-width: 40px; 
              height: auto; 
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png" alt="Logo Outlet" class="logo"" />
              <div class="title">${process.env.NEXT_PUBLIC_APP_NAME || 'KIFA BAKERY'}</div>
              <div class="info">${outlet.name}</div>
              <div class="info">Rajanya Roti Hajatan</div>
              <div class="info">Alamat: ${outlet.address}</div>
              <div class="info">Telp: ${outlet.phone}</div>

              <div class="divider"></div>
            <div class="info">No. Invoice: ${transaction.order_number}</div>
            <div class="info">Tanggal: ${transaction.created_at}</div>
            <div class="info">Kasir: ${transaction.user}</div>
          </div>
          <div class="divider"></div>
          <div>
            ${transaction.items.map(item => `
              <div class="item">
                <div>${item.quantity}x ${item.product}</div>
                <div>Rp ${Number(item.price * item.quantity).toLocaleString()}</div>
              </div>
              `).join('')}
              ${parseInt(transaction.tax) > 0
          ? `
                <div class="item">
                <div>PPN:</div>
                <div>Rp ${Number(transaction.tax).toLocaleString()}</div>
                </div>
                `
          : ''
        }
              <div class="divider"></div>
              <div class="item">
                <div>Subtotal: </div>
                <div>Rp ${Number(transaction.subtotal).toLocaleString()}</div>
              </div>
          </div>
          <div class="divider"></div>
          <div class="total">Total: Rp ${Number(transaction.total).toLocaleString()}</div>
           ${transaction.payment_method === 'cash'
          ? `
          <div class="item">
            <div>Metode Pembayaran:</div>
            <div>${transaction.payment_method === "cash" ? "TUNAI" : "QRIS"}</div>
          </div>
          <div class="item">
            <div>Bayar:</div>
            <div>Rp ${Number(transaction.total_paid).toLocaleString()}</div>
          </div>
          <div class="item">
            <div>Kembalian:</div>
            <div>Rp ${Number(transaction.change).toLocaleString()}</div>
          </div>
        `
          : ''
        }
          <div class="divider"></div>
          <div class="footer">
            Terima kasih atas kunjungan Anda!
          </div>
        </body>
        </html>
      `

      // Write content to the new window
      printWindow.document.open()
      printWindow.document.write(receiptContent)
      printWindow.document.close()

      // Trigger print when content is loaded
      printWindow.onload = function () {
        printWindow.print()
        // Close the window after printing (optional - some browsers might close automatically)
        // printWindow.close()
      }
    } else {
      console.error('Failed to open print window')
      alert('Tidak dapat membuka jendela cetak. Periksa pengaturan popup browser Anda.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px]">
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
            {user?.id && transactionData?.data.total_orders ? <Button onClick={() => printOrders({ outlet: user?.outlet, transactions: transactionData?.data })}><Printer /> Cetak</Button> : null}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari transaksi berdasarkan invoice..."
              className="pl-8 border-orange-200 w-full sm:w-[400px]"
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
                          : "bg-blue-100 text-blue-800 border-blue-200"
                          }`}
                      >
                        {transaction.payment_method === "cash" ? "Tunai" : "QRIS"}
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
                        <Button
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
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
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