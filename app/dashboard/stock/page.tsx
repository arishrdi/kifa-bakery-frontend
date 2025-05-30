"use client";

import { useEffect, useState } from "react";
import { useOutlet } from "@/contexts/outlet-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, Search, Store } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import {
  getInventoryByDate,
  getRealtimeStock,
} from "@/services/report-service";
import { useInventoryHistoryByOutlet } from "@/services/inventory-service";
import TransferStokContent from "@/components/products/transfer-stock-content";
import ApproveStock from "@/components/products/approve-stock";
import AdjustmentContent from "@/components/products/adjustment-content";
import Form from "next/form";
import { Inventory } from "@/types/inventory";
import { Product } from "@/types/product";

export default function StockPage() {
  const { currentOutlet } = useOutlet();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [dateHistory, setDateHistory] = useState<Date>(new Date());
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "realtime";

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([]);

  const formattedDate = date.toLocaleDateString("sv-SE");
  const formattedDateHistory = dateHistory.toLocaleDateString("sv-SE");

  const queryStock = getRealtimeStock(currentOutlet?.id || 0);

  const { data: stockData } = queryStock();

  const { data: inventoryHistoryData } = useInventoryHistoryByOutlet(
    currentOutlet?.id || 0,
    formattedDateHistory,
  );
  const { data: inventoryByDateData, isLoading: isInventoryByDateLoading } =
    getInventoryByDate(currentOutlet?.id || 0, formattedDate);

  const handleProductsSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLocaleLowerCase();
    setSearchQuery(value)
    
    const newFilteredProducts = inventoryByDateData?.data.inventory_items.filter((product) =>
      product.product_name.toLowerCase().includes(value)
    );

    setFilteredProducts(newFilteredProducts);
  }

  useEffect(() => {
    setFilteredProducts(inventoryByDateData?.data.inventory_items || []);
    setSearchQuery("")
  }, [inventoryByDateData])

  const showProductDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Stok</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              name="search"
              placeholder="Cari produk..."
              className="w-[200px] pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={handleProductsSearch}
            />
          </div>
        </div>
      </div>

      {currentOutlet && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>Menampilkan stok untuk: {currentOutlet.name}</AlertTitle>
          <AlertDescription>
            Data stok yang ditampilkan adalah untuk outlet {currentOutlet.name}.
          </AlertDescription>
        </Alert>
      )}

      {tab === "transfer" && <TransferStokContent search={searchQuery} />}

      {tab === "approve" && <ApproveStock search={searchQuery} />}

      {tab === "adjustment" && <AdjustmentContent search={searchQuery} />}


      {tab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Stok</CardTitle>
            <CardDescription>
              Laporan perubahan stok per tanggal untuk{" "}
              {currentOutlet ? currentOutlet.name : "semua outlet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="date">Pilih Tanggal</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateHistory}
                      onSelect={(newDate) => newDate && setDateHistory(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jam</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">
                      Stok Sebelumnya
                    </TableHead>
                    <TableHead className="text-right">Stok Baru</TableHead>
                    <TableHead className="text-right">Perubahan</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryHistoryData?.data.filter(product => 
                    product.product?.name.toLowerCase().includes(searchQuery) || product.user?.name.toLowerCase().includes(searchQuery)
                  )
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {format(item.created_at, "HH:mm", { locale: id })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product?.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity_before}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity_after}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            item.quantity_change > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {item.quantity_change > 0
                            ? `+${item.quantity_change}`
                            : item.quantity_change}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.type === "purchase" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            Pembelian
                          </Badge>
                        ) : item.type === "sale" ? (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          >
                            Penjualan
                          </Badge>
                        ) : item.type === "adjustment" ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            Penyesuaian
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                          >
                            Lainnya
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "custom" && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Stok Per Tanggal</CardTitle>
            <CardDescription>
              Lihat stok pada tanggal tertentu untuk{" "}
              {currentOutlet ? currentOutlet.name : "semua outlet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="date">Pilih Tanggal</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
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
                    {isInventoryByDateLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((item) => (
                        <TableRow key={item.product_id}>
                          <TableCell className="font-medium">
                            {item.product_name}
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell>
                            {item.quantity >= item.min_stock && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              >
                                Normal
                              </Badge>
                            )}
                            {item.quantity < item.min_stock && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              >
                                Stok Rendah
                              </Badge>
                            )}
                            {item.quantity === 0 && (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              >
                                Habis
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Produk</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai produk
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Produk</p>
                  <p className="font-medium">{selectedProduct.product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p>{selectedProduct.product.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stok Saat Ini</p>
                  <p className="font-medium">{selectedProduct.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimal Stok</p>
                  <p>{selectedProduct.min_stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {selectedProduct.quantity >= selectedProduct.min_stock && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Normal
                    </Badge>
                  )}
                  {selectedProduct.quantity < selectedProduct.min_stock &&
                    selectedProduct.quantity > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        Stok Rendah
                      </Badge>
                    )}
                  {selectedProduct.quantity === 0 && (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    >
                      Habis
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Terakhir Diperbarui
                  </p>
                  <p>
                    {format(selectedProduct.updated_at, "PPP", { locale: id })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">SKU</p>
                <p>{selectedProduct.product.sku || "-"}</p>
              </div>

              {selectedProduct.product.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Deskripsi</p>
                  <p>{selectedProduct.product.description}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDetailOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
