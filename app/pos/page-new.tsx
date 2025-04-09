"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCard, Clock, Search, ShoppingCart, Trash2, User, History } from "lucide-react"
import { PaymentModal } from "@/components/pos/payment-modal"
import { TransactionHistoryModal } from "@/components/pos/transaction-history-modal"
import { ProductGrid } from "@/components/pos/product-grid"
import { CashRegister } from "@/components/pos/cash-register"

// Sample product data
// const products = [
//   {
//     id: 1,
//     name: "Roti Tawar",
//     price: 15000,
//     category: "Roti",
//     stock: 25,
//     image: "/placeholder.svg?height=80&width=80",
//   },
//   {
//     id: 2,
//     name: "Donat Coklat",
//     price: 8000,
//     category: "Donat",
//     stock: 18,
//     image: "/placeholder.svg?height=80&width=80",
//   },
//   { id: 3, name: "Kue Lapis", price: 25000, category: "Kue", stock: 10, image: "/placeholder.svg?height=80&width=80" },
//   {
//     id: 4,
//     name: "Croissant",
//     price: 18000,
//     category: "Pastry",
//     stock: 12,
//     image: "/placeholder.svg?height=80&width=80",
//   },
//   { id: 5, name: "Brownies", price: 20000, category: "Kue", stock: 8, image: "/placeholder.svg?height=80&width=80" },
//   {
//     id: 6,
//     name: "Bolu Pandan",
//     price: 22000,
//     category: "Kue",
//     stock: 15,
//     image: "/placeholder.svg?height=80&width=80",
//   },
//   { id: 7, name: "Pie Buah", price: 23000, category: "Pastry", stock: 9, image: "/placeholder.svg?height=80&width=80" },
//   {
//     id: 8,
//     name: "Roti Sobek",
//     price: 17000,
//     category: "Roti",
//     stock: 20,
//     image: "/placeholder.svg?height=80&width=80",
//   },
// ]

// Sample categories
const categories = ["Semua", "Roti", "Donat", "Kue", "Pastry"]

export default function POSPage() {
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Add product to cart
  const addToCart = (product: (typeof products)[0]) => {
    // Don't add if product is out of stock
    if (product.stock <= 0) return

    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }])
    }
  }

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate tax (10%)
  const tax = subtotal * (user)

  // Calculate total
  const total = subtotal + tax

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-orange-500 mr-2" />
            <h1 className="text-xl font-bold text-orange-500">Kifa Bakery POS</h1>
          </div>
          <div className="flex items-center space-x-4">
            <CashRegister />
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
              <Clock className="mr-2 h-4 w-4" />
              Shift: Siang (14:00 - 22:00)
            </Badge>
            <div className="flex items-center">
              <User className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">Dinda (Kasir)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Products (Left side) */}
        <div className="w-full md:w-2/3 p-4 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex flex-col mb-4 gap-3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari produk..."
                className="pl-8 border-orange-200 focus-visible:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex overflow-x-auto gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={
                    activeCategory === category
                      ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                      : "hover:bg-orange-100 cursor-pointer border-orange-200"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 rounded-md border border-orange-100">
            <div className="p-4">
              <ProductGrid
                products={products}
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                addToCart={addToCart}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Cart (Right side) */}
        <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-orange-200 flex flex-col h-[calc(100vh-64px)]">
          <Card className="h-full flex flex-col rounded-none border-x-0 border-b-0">
            <CardHeader className="border-b border-orange-200">
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-orange-500" />
                Keranjang
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-4">
              {cart.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center border-orange-200">
                  <ShoppingCart className="h-10 w-10 text-orange-300" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Keranjang kosong. Tambahkan produk untuk memulai transaksi.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div>
                            {item.name}
                            <div className="text-xs text-muted-foreground">Rp {item.price.toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 border-orange-200"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 border-orange-200"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">Rp {(item.price * item.quantity).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>

            {/* Cart summary */}
            <div className="border-t border-orange-200 p-4">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak (10%)</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">Rp {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="mt-auto border-t border-orange-200 p-4">
              <div className="grid grid-cols-1 gap-2 mb-2">
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={cart.length === 0}
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pembayaran
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full border-orange-200"
                onClick={() => setIsHistoryModalOpen(true)}
              >
                <History className="mr-2 h-4 w-4" />
                Riwayat Transaksi
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        total={total}
        cart={cart}
        onSuccess={() => setCart([])}
      />

      {/* Transaction History Modal */}
      <TransactionHistoryModal open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen} />
    </div>
  )
}

