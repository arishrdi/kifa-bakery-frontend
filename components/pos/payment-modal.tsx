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

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number,
  tax: number,
  cart: Array<{ id: number; name: string; price: number; quantity: number }>
  onSuccess: () => void
}

export function PaymentModal({ open, onOpenChange, total, cart, onSuccess, tax }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("tunai")
  const [amountPaid, setAmountPaid] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [processing, setProcessing] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  const { user } = useAuth();
  const { mutate: createOrderMutation, isPending: isCreatingOrder, isSuccess: isSuccessOrder } = createOrder();
  // console.log(total)
  const { invalidate } = useInvalidateQueries()

  const handlePayment = () => {
    // setProcessing(true)
    // console.log({total, cart})

    if (!user) {
      return
    }

    createOrderMutation({
      outlet_id: user.outlet_id,
      shift_id: user.last_shift.id,
      payment_method: paymentMethod === "tunai" ? "cash" : "qris",
      total_paid: Number(amountPaid),
      tax: tax,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }, {
      onSuccess: () => {
        invalidate(['products-outlet', 'orders-history'])
        setCompleted(true)
        setTimeout(() => {
          onSuccess()
          setCompleted(false)
          setPaymentMethod("tunai")
          setAmountPaid("")
          setCardNumber("")
          onOpenChange(false)
        }, 1500)
      }
    })
    // console.log({ paymentMethod, cart, amountPaid, total, tax })

    // if (orderData?.data) {
    //   setCompleted(true)
    //   setTimeout(() => {

    //     invalidate(['products-outlet', `${user.outlet_id}`])
    //     onSuccess()
    //     setCompleted(false)
    //     setPaymentMethod("tunai")
    //     setAmountPaid("")
    //     setCardNumber("")
    //     onOpenChange(false)
    //   }, 1500)
    // }

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Pembayaran</DialogTitle>
          <DialogDescription>Selesaikan transaksi dengan memilih metode pembayaran</DialogDescription>
        </DialogHeader>

        {completed ? (
          <div className="py-6 text-center px-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-700">Pembayaran Berhasil!</h3>
            <p className="mt-2 text-muted-foreground">Transaksi telah berhasil diselesaikan</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="rounded-md bg-orange-50 p-4 mb-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total Pembayaran</span>
                  <span className="text-xl text-orange-600">Rp {total.toLocaleString()}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{cart.length} item dalam transaksi</div>
              </div>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                <div className="flex flex-col space-y-3">
                  <Label className="font-medium mb-1">Metode Pembayaran</Label>
                  <div
                    className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer"
                    onClick={() => setPaymentMethod("tunai")}
                  >
                    <RadioGroupItem value="tunai" id="tunai" />
                    <Banknote className="h-4 w-4 text-orange-500 ml-1 mr-2" />
                    <Label htmlFor="tunai" className="cursor-pointer flex-1">
                      Tunai
                    </Label>
                  </div>
                  <div
                    className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer"
                    onClick={() => setPaymentMethod("qris")}
                  >
                    <RadioGroupItem value="qris" id="qris" />
                    <CreditCard className="h-4 w-4 text-orange-500 ml-1 mr-2" />
                    <Label htmlFor="qris" className="cursor-pointer flex-1">
                      QRIS
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {paymentMethod === "tunai" && (
                <div className="space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Jumlah Uang Diterima</Label>
                    <Input
                      id="amount"
                      placeholder="Masukkan jumlah uang"
                      value={amountPaid ? `Rp ${Number.parseInt(amountPaid).toLocaleString()}` : ""}
                      onChange={handleAmountChange}
                      className="border-orange-200"
                    />
                  </div>

                  {amountPaid && (
                    <div className="rounded-md bg-muted p-3">
                      <div className="flex justify-between mb-1">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Dibayar</span>
                        <span>Rp {amountPaidValue.toLocaleString()}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Kembalian</span>
                        <span className={change < 0 ? "text-red-500" : "text-green-600"}>
                          Rp {change < 0 ? `(${Math.abs(change).toLocaleString()})` : change.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {paymentMethod === "qris" && (
                <div className="space-y-3">
                  <div className="flex justify-center p-4 bg-muted rounded-md">
                    <div className="w-48 h-48 bg-white p-2 rounded-md flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=160&width=160"
                        alt="QRIS Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Scan kode QR di atas menggunakan aplikasi e-wallet atau mobile banking Anda
                  </div>
                </div>
              )}
              <div className="h-4"></div> {/* Add some padding at the bottom */}
            </ScrollArea>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-orange-200"
                disabled={processing}
              >
                Batal
              </Button>
              <Button
                type="submit"
                onClick={handlePayment}
                className="bg-orange-500 hover:bg-orange-600"
                disabled={
                  processing ||
                  (paymentMethod === "tunai" && !sufficientAmount)
                }
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Bayar Sekarang"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

