"use client"

import { Eye } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { OrderItem } from "@/types/order-history"

export default function TransactionDetailDialog({ trx }: { trx: OrderItem }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Lihat detail transaksi"
          className="h-8 w-8 hover:bg-primary/10 border-primary"
        >
          <Eye className="h-4 w-4 text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Detail Transaksi</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Invoice: {trx.order_number}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Header */}
          <div className="flex gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Tanggal</p>
              <p>{trx.created_at}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Status</p>
              <Badge
                variant={
                  trx.status === 'completed' ? 'default'
                    : trx.status === 'cancelled' ? 'destructive'
                      : 'outline'
                }
                className="capitalize"
              >
                {trx.status === 'completed' ? "Selesai"
                  : trx.status === 'cancelled' ? "Dibatalkan"
                    : "Menunggu"}
              </Badge>
            </div>
          </div>

          {/* Daftar Item */}
          <div className="border rounded-lg">
            <div className="p-3 bg-muted/50 grid grid-cols-4 text-sm font-medium">
              <div>Produk</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Harga</div>
              <div className="text-right">Total</div>
            </div>

            <div className="divide-y">
              {trx.items.map((item, i) => (
                <div key={i} className="p-3 grid grid-cols-4 text-sm">
                  <div className="font-medium truncate">{item.product}</div>
                  <div className="text-center">x{item.quantity}</div>
                  <div className="text-right">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(Number(item.price))}
                  </div>
                  <div className="text-right font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(Number(item.total))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(Number(trx.subtotal))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pajak: </span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(Number(trx.tax))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Diskon: </span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(Number(trx.discount))}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(Number(trx.total))}
              </span>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-primary">
                <span>Total Bayar</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(Number(trx.total_paid))}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Kembalian</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(Number(trx.change))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
