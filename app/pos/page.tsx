"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreditCard, Clock, Search, ShoppingCart, Trash2, User, History, LogOut, Menu, PackagePlus } from "lucide-react"
import { PaymentModal } from "@/components/pos/payment-modal"
import { TransactionHistoryModal } from "@/components/pos/transaction-history-modal"
import { ProductGrid } from "@/components/pos/product-grid"
import { CashRegister } from "@/components/pos/cash-register"
import { getAllCategories } from "@/services/category-service"
import { getAllProductsByOutlet } from "@/services/product-service"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getCashBalanceByOutlet } from "@/services/cash-transaction-service"
import { Product } from "@/types/product"
import AdjustStock from "@/components/pos/adjust-stock"

export default function POSPage() {
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [localProducts, setLocalProducts] = useState<Product[]>([])

  const { user, logout } = useAuth()

  const outletId = Number(user?.outlet_id) || 1

  const queryCashBalance = getCashBalanceByOutlet(outletId)
  const { data: cashBalance, refetch: refetchBalance } = queryCashBalance()

  const query = getAllProductsByOutlet(outletId)
  const { data: products, isLoading, refetch: refetchProducts } = query()

  useEffect(() => {
    if (products?.data) {
      setLocalProducts(products.data)
    }
  }, [products])


  const { data: categories } = getAllCategories()

  console.log({ cashBalance, outletId })

  const addToCart = (product: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }) => {
    // Cek stok tersedia
    const currentProduct = localProducts.find(p => p.id === product.id);
    if (!currentProduct || currentProduct.quantity < 1) return;

    // Update keranjang
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }

    // Update stok lokal
    setLocalProducts(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  const removeFromCart = (id: number) => {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    // Kembalikan stok
    setLocalProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + item.quantity } : p
      )
    );

    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;

    // Hitung perubahan kuantitas
    const item = cart.find(item => item.id === id);
    if (!item) return;

    const quantityChange = quantity - item.quantity;
    const currentProduct = localProducts.find(p => p.id === id);

    // Validasi stok
    if (currentProduct && (currentProduct.quantity - quantityChange) < 0) return;

    // Update keranjang
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ));

    // Update stok lokal
    if (currentProduct) {
      setLocalProducts(prev =>
        prev.map(p =>
          p.id === id ? { ...p, quantity: p.quantity - quantityChange } : p
        )
      );
    }
  };

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate tax
  const taxRate = (user?.outlet.tax ?? 0) / 100;
  const tax = subtotal ? subtotal * taxRate : 0;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png" alt="Logo kifa" width={50} height={50} className="w-7 mr-4" />
            <h1 className="text-xl font-bold text-orange-500">{user?.outlet?.name}</h1>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <AdjustStock products={localProducts} />
            <CashRegister outletId={outletId} cashBalance={Number(cashBalance?.data.balance) || 0} />
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Shift:</span> {user?.last_shift?.start_time} - {user?.last_shift?.end_time}
            </Badge>
            <div className="flex items-center">
              <User className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">{user?.name} ({user?.role})</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-orange-200 hover:bg-orange-100 hover:text-orange-700"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
            </Button>
          </div>
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-3">
            <div className="flex items-center">
              <User className="h-5 w-5 text-orange-500 mr-1" />
              <span className="font-medium text-sm">{user?.name}</span>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="border-orange-200">
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2" align="end">
                <div className="space-y-2">
                  <div className="p-2 rounded-md bg-orange-50">
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="font-medium">{user?.name} ({user?.role})</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 w-full justify-start mt-1">
                      <Clock className="mr-2 h-3 w-3" />
                      Shift: ({user?.last_shift?.start_time} - {user?.last_shift?.end_time})
                    </Badge>
                  </div>

                  <div className="p-2">
                    <CashRegister outletId={outletId} cashBalance={Number(cashBalance?.data.balance) || 0} />
                  </div>
                  <Separator />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-orange-200 hover:bg-orange-100 hover:text-orange-700"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
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
              <Badge
                variant="outline"
                className="hover:bg-orange-100 cursor-pointer border-orange-200"
                onClick={() => setActiveCategory("Semua")}
              >
                Semua
              </Badge>
              {categories?.data.map((category) => (
                <Badge
                  key={category.id}
                  variant={activeCategory === category.name ? "default" : "outline"}
                  className={
                    activeCategory === category.name
                      ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                      : "hover:bg-orange-100 cursor-pointer border-orange-200"
                  }
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1 rounded-md border border-orange-100">
            <div className="p-4">
              {!products?.data ? (
                <EmptyProduct />
              ) : (
                <ProductGrid
                  products={localProducts}
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  addToCart={addToCart}
                  tax={tax}
                />
              )}
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
                  <span className="text-muted-foreground">Pajak ({parseFloat(user?.outlet?.tax)}%)</span>
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
        tax={tax}
        cart={cart}
        refetchBalance={refetchBalance}
        onSuccess={() => setCart([])}
      />

      {/* Transaction History Modal */}
      <TransactionHistoryModal open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen} refetchBalance={refetchBalance} />
    </div>
  )
}

function EmptyProduct() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-60 border border-dashed rounded-lg border-orange-200">
      <div className="text-orange-500 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
      <p className="text-muted-foreground text-center mx-2">
        Produk kosong.
      </p>
    </div>
  )
}
