"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Banknote, ChevronsUpDown, Plus, Minus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getCashBalanceByOutlet, addCashTransaction, subtractCashTransaction } from "@/services/cash-transaction-service"
import { useAuth } from "@/contexts/auth-context"
import { useInvalidateQueries } from "@/hooks/use-invalidate-queries"

export function CashRegister({ outletId, cashBalance }: { outletId: number, cashBalance: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [operationType, setOperationType] = useState<"add" | "remove">("add")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  // if (!user) {
  //   return null
  // }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAmount(value)
  }

  // const query = getCashBalanceByOutlet(outletId)
  // const { data: cashBalance } = query()

  const { mutate: addCash, isPending: isAddingCash } = addCashTransaction()
  const { mutate: subtractCash, isPending: isSubtractingCash } = subtractCashTransaction()

  const { invalidate } = useInvalidateQueries()
  const handleSubmit = () => {
    const amountValue = Number.parseInt(amount) || 0

    if (operationType === "add") {
      addCash({ amount: amountValue, outlet_id: outletId, reason: note }, {onSuccess:() => {
        invalidate(['cash-register', `${outletId}`])
      }})
    } else {
      subtractCash({ amount: amountValue, outlet_id: outletId, reason: note }, {onSuccess:() => {
        invalidate(['cash-register', `${outletId}`])
      }})
    }

    // Reset form
    setAmount("")
    setNote("")
    setIsOpen(false)
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-orange-200 bg-orange-50 hover:bg-orange-100">
            <Banknote className="mr-2 h-4 w-4 text-orange-500" />
            {/* <span className="font-medium">Rp {Number(cashBalance).toLocaleString()}</span> */}
            Kas kasir
            <ChevronsUpDown className="ml-2 h-4 w-4 text-orange-500 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <h4 className="font-medium text-sm">Kas Kasir</h4>
              <p className="text-2xl font-bold text-orange-600">Rp {Number(cashBalance).toLocaleString()}</p>
              {/* <p className="text-xs text-muted-foreground">Terakhir diperbarui: {new Date(cashBalance?.data.updated_at || new Date()).toLocaleTimeString()}</p> */}
            </div>
            <Separator />
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="border-orange-200 w-[48%]"
                onClick={() => {
                  setOperationType("add")
                  setIsOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4 text-green-500" />
                Tambah Kas
              </Button>
              <Button
                variant="outline"
                className="border-orange-200 w-[48%]"
                onClick={() => {
                  setOperationType("remove")
                  setIsOpen(true)
                }}
              >
                <Minus className="mr-2 h-4 w-4 text-red-500" />
                Ambil Kas
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{operationType === "add" ? "Tambah Kas" : "Ambil Kas"}</DialogTitle>
            <DialogDescription>
              {operationType === "add"
                ? "Masukkan jumlah kas yang akan ditambahkan ke mesin kasir."
                : "Masukkan jumlah kas yang akan diambil dari mesin kasir."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                placeholder="Masukkan jumlah"
                value={amount ? `Rp ${Number.parseInt(amount).toLocaleString()}` : ""}
                onChange={handleAmountChange}
                className="border-orange-200"
                required
              />
            </div>

            {/* {operationType === "remove" && (
              <div className="grid gap-2">
                <Label htmlFor="reason">Alasan Pengambilan</Label>
                <RadioGroup defaultValue="shift-change" className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 border rounded-md p-2">
                    <RadioGroupItem value="shift-change" id="shift-change" />
                    <Label htmlFor="shift-change" className="cursor-pointer">
                      Pergantian Shift
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2">
                    <RadioGroupItem value="deposit" id="deposit" />
                    <Label htmlFor="deposit" className="cursor-pointer">
                      Setoran
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2">
                    <RadioGroupItem value="correction" id="correction" />
                    <Label htmlFor="correction" className="cursor-pointer">
                      Koreksi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">
                      Lainnya
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )} */}

            <div className="grid gap-2">
              <Label htmlFor="note">Catatan</Label>
              <Input
                id="note"
                placeholder="Tambahkan catatan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border-orange-200"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-orange-200">
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={!amount || Number.parseInt(amount) <= 0 || !note}
            >
              {operationType === "add" ? "Tambah Kas" : "Ambil Kas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

