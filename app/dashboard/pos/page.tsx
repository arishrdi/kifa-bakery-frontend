"use client"

import { useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Search, ShoppingCart, Trash2, Printer, CreditCard, Banknote, Store } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample product data
const products = [
  { id: 1, name: "Produk A", price: 25000, category: "Kategori 1", stock: 25 },
  { id: 2, name: "Produk B", price: 35000, category: "Kategori 2", stock: 8 },
  { id: 3, name: "Produk C", price: 15000, category: "Kategori 1", stock: 0 },
  { id: 4, name: "Produk D", price: 45000, category: "Kategori 3", stock: 42 },
  { id: 5, name: "Produk E", price: 55000, category: "Kategori 2", stock: 3 },
  { id: 6, name: "Produk F", price: 65000, category: "Kategori 1", stock: 15 },
  { id: 7, name: "Produk G", price: 75000, category: "Kategori 3", stock: 7 },
  { id: 8, name: "Produk H", price: 85000, category: "Kategori 2", stock: 12 },
]

// Sample categories
const categories = ["Semua", "Kategori 1", "Kategori 2", "Kategori 3"]

export default function POSPage() {
  const { currentOutlet } = useOutlet()
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([])
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "Semua" || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Add product to cart
  const addToCart = (product: (typeof products)[0]) => {
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
  const tax = subtotal * 0.1

  // Calculate total
  const total = subtotal + tax

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Point of Sale</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Shift Aktif: <span className="font-medium">Siang (14:00 - 22:00)</span>
          </div>
        </div>
      </div>

      {currentOutlet && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>POS Aktif: {currentOutlet.name}</AlertTitle>
          <AlertDescription>Transaksi akan dicatat untuk outlet {currentOutlet.name}.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-1 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Produk</CardTitle>
                <div className="relative w-[200px] md:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari produk..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>Pilih produk untuk ditambahkan ke keranjang</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="Semua" className="w-full">
                <TabsList className="mb-4 flex h-auto flex-wrap justify-start rounded-none border-b bg-transparent p-0">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      onClick={() => setActiveCategory(category)}
                      className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={activeCategory} className="mt-0">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className={`cursor-pointer ${product.stock === 0 ? "opacity-50" : ""}`}>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          <CardDescription>{product.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-lg font-bold">Rp {product.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Stok: {product.stock}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button onClick={() => addToCart(product)} disabled={product.stock === 0} className="w-full">
                            Tambah
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Keranjang
              </CardTitle>
              <CardDescription>{cart.length} item dalam keranjang</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {cart.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
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
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">Rp {item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">Rp {(item.price * item.quantity).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="flex flex-col border-t p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (10%)</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={cart.length === 0}>
                  <Printer className="mr-2 h-4 w-4" />
                  Cetak Struk
                </Button>
                <Button disabled={cart.length === 0}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Bayar
                </Button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={cart.length === 0}>
                  <Banknote className="mr-2 h-4 w-4" />
                  Tunai
                </Button>
                <Button variant="outline" disabled={cart.length === 0}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Non-Tunai
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

