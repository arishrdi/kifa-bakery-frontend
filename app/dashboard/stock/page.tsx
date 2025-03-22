"use client"

import { useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Search, Store } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from "next/navigation"

const stockData = [
  {
    id: 1,
    name: "Produk A",
    category: "Kategori 1",
    currentStock: 25,
    minStock: 10,
    status: "normal",
    lastUpdated: "2023-03-20",
  },
  {
    id: 2,
    name: "Produk B",
    category: "Kategori 2",
    currentStock: 8,
    minStock: 10,
    status: "low",
    lastUpdated: "2023-03-20",
  },
  {
    id: 3,
    name: "Produk C",
    category: "Kategori 1",
    currentStock: 0,
    minStock: 5,
    status: "out",
    lastUpdated: "2023-03-19",
  },
  {
    id: 4,
    name: "Produk D",
    category: "Kategori 3",
    currentStock: 42,
    minStock: 15,
    status: "normal",
    lastUpdated: "2023-03-20",
  },
  {
    id: 5,
    name: "Produk E",
    category: "Kategori 2",
    currentStock: 3,
    minStock: 10,
    status: "low",
    lastUpdated: "2023-03-18",
  },
]

const stockHistoryData = [
  {
    id: 1,
    date: "2023-03-20",
    productId: 1,
    productName: "Produk A",
    previousStock: 20,
    newStock: 25,
    change: 5,
    type: "addition",
    notes: "Restock dari supplier",
  },
  {
    id: 2,
    date: "2023-03-20",
    productId: 2,
    productName: "Produk B",
    previousStock: 12,
    newStock: 8,
    change: -4,
    type: "reduction",
    notes: "Penjualan",
  },
  {
    id: 3,
    date: "2023-03-19",
    productId: 3,
    productName: "Produk C",
    previousStock: 3,
    newStock: 0,
    change: -3,
    type: "reduction",
    notes: "Penjualan",
  },
  {
    id: 4,
    date: "2023-03-19",
    productId: 1,
    productName: "Produk A",
    previousStock: 15,
    newStock: 20,
    change: 5,
    type: "addition",
    notes: "Restock dari supplier",
  },
  {
    id: 5,
    date: "2023-03-18",
    productId: 5,
    productName: "Produk E",
    previousStock: 8,
    newStock: 3,
    change: -5,
    type: "reduction",
    notes: "Penjualan",
  },
]

export default function StockPage() {
  const { currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "realtime"

  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [sourceOutlet, setSourceOutlet] = useState<string>("")
  const [destinationOutlet, setDestinationOutlet] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [notes, setNotes] = useState<string>("")

  // Filter stock data based on search query
  const filteredStockData = stockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Stok</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="w-[200px] pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </div>
      </div>

      {currentOutlet && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>Menampilkan stok untuk: {currentOutlet.name}</AlertTitle>
          <AlertDescription>Data stok yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
        </Alert>
      )}

      {tab === "realtime" && (
        <Card>
          <CardHeader>
            <CardTitle>Stok Realtime</CardTitle>
            <CardDescription>
              Menampilkan stok saat ini untuk {currentOutlet ? currentOutlet.name : "semua outlet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Stok Saat Ini</TableHead>
                  <TableHead className="text-right">Min. Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terakhir Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.currentStock}</TableCell>
                    <TableCell className="text-right">{item.minStock}</TableCell>
                    <TableCell>
                      {item.status === "normal" && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          Normal
                        </Badge>
                      )}
                      {item.status === "low" && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        >
                          Stok Rendah
                        </Badge>
                      )}
                      {item.status === "out" && (
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                          Habis
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Stok</CardTitle>
            <CardDescription>
              Laporan perubahan stok per tanggal untuk {currentOutlet ? currentOutlet.name : "semua outlet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead className="text-right">Stok Sebelumnya</TableHead>
                  <TableHead className="text-right">Stok Baru</TableHead>
                  <TableHead className="text-right">Perubahan</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockHistoryData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right">{item.previousStock}</TableCell>
                    <TableCell className="text-right">{item.newStock}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.change > 0 ? "text-green-600" : "text-red-600"}>
                        {item.change > 0 ? `+${item.change}` : item.change}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.type === "addition" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          Penambahan
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                          Pengurangan
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "custom" && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Stok Per Tanggal</CardTitle>
            <CardDescription>
              Lihat stok pada tanggal tertentu untuk {currentOutlet ? currentOutlet.name : "semua outlet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="date">Pilih Tanggal</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal")}>
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
                <Button className="mt-auto">Lihat Stok</Button>
              </div>
              <div className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-right">Stok</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.currentStock}</TableCell>
                        <TableCell>
                          {item.status === "normal" && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            >
                              Normal
                            </Badge>
                          )}
                          {item.status === "low" && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            >
                              Stok Rendah
                            </Badge>
                          )}
                          {item.status === "out" && (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            >
                              Habis
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "transfer" && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Stok Antar Outlet</CardTitle>
            <CardDescription>Kelola perpindahan stok antar outlet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-outlet">Outlet Sumber</Label>
                  <Select value={sourceOutlet} onValueChange={setSourceOutlet}>
                    <SelectTrigger id="source-outlet">
                      <SelectValue placeholder="Pilih outlet sumber" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Outlet Pusat</SelectItem>
                      <SelectItem value="2">Outlet Cabang Selatan</SelectItem>
                      <SelectItem value="3">Outlet Cabang Timur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination-outlet">Outlet Tujuan</Label>
                  <Select value={destinationOutlet} onValueChange={setDestinationOutlet}>
                    <SelectTrigger id="destination-outlet">
                      <SelectValue placeholder="Pilih outlet tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Outlet Pusat</SelectItem>
                      <SelectItem value="2">Outlet Cabang Selatan</SelectItem>
                      <SelectItem value="3">Outlet Cabang Timur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produk</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Pilih produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockData.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} - Stok: {product.currentStock}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  type="number"
                  id="quantity"
                  min="1"
                  placeholder="Masukkan jumlah"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  placeholder="Catatan transfer (opsional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button className="w-full md:w-auto">Transfer Stok</Button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Riwayat Transfer Stok</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Dari Outlet</TableHead>
                    <TableHead>Ke Outlet</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-03-20</TableCell>
                    <TableCell>Outlet Pusat</TableCell>
                    <TableCell>Outlet Cabang Selatan</TableCell>
                    <TableCell>Produk A</TableCell>
                    <TableCell className="text-right">10</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Selesai
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-03-19</TableCell>
                    <TableCell>Outlet Pusat</TableCell>
                    <TableCell>Outlet Cabang Timur</TableCell>
                    <TableCell>Produk B</TableCell>
                    <TableCell className="text-right">15</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Selesai
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-03-18</TableCell>
                    <TableCell>Outlet Cabang Selatan</TableCell>
                    <TableCell>Outlet Cabang Timur</TableCell>
                    <TableCell>Produk D</TableCell>
                    <TableCell className="text-right">5</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        Dalam Proses
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

