"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Banknote, CheckCircle, CreditCard, Loader2 } from "lucide-react"

// Keep the imports and add ScrollArea import
import { ScrollArea } from "@/components/ui/scroll-area"
import { createOrder } from "@/services/order-service"
import { useAuth } from "@/contexts/auth-context"
import { useInvalidateQueries } from "@/hooks/use-invalidate-queries"
import Image from "next/image"
import { handlePrintReceipt, PrintInvoice } from "./print-invoice"
import { useQueryClient } from "@tanstack/react-query"
import { MemberComboBox } from "@/app/pos/member-combobox"
import { Member } from "@/types/member"
import { OrderResponse } from "@/types/order"
import { useOutlet } from "@/contexts/outlet-context"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number,
  tax: number,
  cart: Array<{ id: number; name: string; price: number; quantity: number }>
  onSuccess: () => void
  refetchBalance: any
}

export function PaymentModal({ open, onOpenChange, total, refetchBalance, cart, onSuccess, tax }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("tunai")
  const [amountPaid, setAmountPaid] = useState<string>("")
  const [processing, setProcessing] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse["data"] | null>(null)

  const { user } = useAuth();
  const { mutate: createOrderMutation, isPending: isCreatingOrder, isSuccess: isSuccessOrder } = createOrder();
  const { invalidate } = useInvalidateQueries()

  const handlePayment = () => {

    if (!user) {
      return
    }

    createOrderMutation({
      outlet_id: user.outlet_id,
      shift_id: user.last_shift.id,
      payment_method: paymentMethod === "tunai" ? "cash" : "qris",
      total_paid: Number(amountPaid),
      tax: tax,
      member_id: selectedMember?.id,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }, {
      onSuccess: (data) => {
        invalidate(['products-outlet', `${user.outlet_id}`])
        invalidate(['orders-history', `${user.outlet_id}`])
        invalidate(['cash-register', `${user.outlet_id}`])
        invalidate(['revenue', `${user.outlet_id}`])


        // invalidate(['cash-register', `${user.outlet_id}`])


        refetchBalance()
        setPaymentMethod("tunai")
        setAmountPaid("")

        console.log({ newOrder: data.data })

        if (data) {
          setSelectedOrder(data.data)
        }

        setCompleted(true)
        // setTimeout(() => {
        //   onSuccess()
        //   setCompleted(false)
        //   setPaymentMethod("tunai")
        //   setAmountPaid("")
        //   setCardNumber("")
        //   onOpenChange(false)
        // }, 1500)
      }
    })

  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAmountPaid(value)
  }

  const amountPaidValue = amountPaid ? Number.parseInt(amountPaid) : 0
  const change = amountPaidValue - total
  const sufficientAmount = amountPaidValue >= total

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-2">
        <DialogHeader className="px-3 pt-3">
          <DialogTitle className="text-sm">Pembayaran</DialogTitle>
          <DialogDescription className="text-xs">
            Selesaikan transaksi dengan memilih metode pembayaran
          </DialogDescription>
        </DialogHeader>

        {completed ? (
          <div className="py-4 text-center px-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-green-700">Pembayaran Berhasil!</h3>
            <p className="mt-1 text-xs text-muted-foreground">Transaksi telah berhasil diselesaikan</p>
            <div className="flex justify-center gap-5 mt-3">
              <Button variant="ghost" onClick={() => handlePrintReceipt(selectedOrder, user?.outlet)}>Cetak Struk</Button>
              <Button variant="destructive" onClick={() => {
                setCompleted(false)
                onOpenChange(false)
                setPaymentMethod("tunai")
                setAmountPaid("")
              }}>Batal</Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-3 overflow-y-scroll">
              <div className="rounded-md bg-orange-50 p-3 mb-3">
                <div className="flex items-center justify-between font-medium text-xs">
                  <span>Total Pembayaran</span>
                  <span className="text-base text-orange-600">Rp {total.toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {cart.length} item dalam transaksi
                </div>
              </div>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-3">
                <div className="flex flex-col space-y-2">
                  <Label className="text-xs font-medium">Metode Pembayaran</Label>
                  <div
                    className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer"
                    onClick={() => setPaymentMethod("tunai")}
                  >
                    <RadioGroupItem value="tunai" id="tunai" />
                    <Banknote className="h-3 w-3 text-orange-500 ml-1 mr-2" />
                    <Label htmlFor="tunai" className="cursor-pointer flex-1 text-xs">
                      Tunai
                    </Label>
                  </div>
                  <div
                    className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer"
                    onClick={() => setPaymentMethod("qris")}
                  >
                    <RadioGroupItem value="qris" id="qris" />
                    <CreditCard className="h-3 w-3 text-orange-500 ml-1 mr-2" />
                    <Label htmlFor="qris" className="cursor-pointer flex-1 text-xs">
                      QRIS
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {paymentMethod === "tunai" && (
                <div className="space-y-2 mb-3">
                  <div className="grid gap-1">
                    <Label htmlFor="amount" className="text-xs">
                      Jumlah Uang Diterima
                    </Label>
                    <Input
                      id="amount"
                      placeholder="Masukkan jumlah uang"
                      value={amountPaid ? `Rp ${Number.parseInt(amountPaid).toLocaleString()}` : ""}
                      onChange={handleAmountChange}
                      className="border-orange-200 text-xs"
                    />
                  </div>

                  {amountPaid && (
                    <div className="rounded-md bg-muted p-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Total</span>
                        <span className="text-xs">Rp {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Dibayar</span>
                        <span className="text-xs">Rp {amountPaidValue.toLocaleString()}</span>
                      </div>
                      <Separator className="my-1" />
                      <div className="flex justify-between font-medium text-xs">
                        <span>{change < 0 ? "Kekurangan" : "Kembalian"}</span>
                        <span className={change < 0 ? "text-red-500" : "text-green-600"}>
                          Rp {change.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {paymentMethod === "qris" && (
                <div className="space-y-2 mb-3">
                  <div className="flex justify-center p-3 bg-muted rounded-md">
                    <div className="w-48 h-48 bg-white p-1 rounded-md flex items-center justify-center">
                      <Image
                        src={user?.outlet.qris_url ?? '/placeholder-logo.png'}
                        alt="QRIS Code"
                        width={700}
                        height={700}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">
                    Scan kode QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="grid gap-1">
                  <Label className="text-xs font-medium">Member</Label>
                  <MemberComboBox onMemberSelect={setSelectedMember} />
                </div>
              </div>
              <div className="h-2"></div>
            </ScrollArea>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-3 px-3 py-3 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-orange-200 text-xs"
                disabled={processing}
              >
                Batal
              </Button>
              <Button
                type="submit"
                onClick={handlePayment}
                className="bg-orange-500 hover:bg-orange-600 text-xs"
                disabled={processing || (paymentMethod === "tunai" && !sufficientAmount)}
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Bayar"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>

  )
}

