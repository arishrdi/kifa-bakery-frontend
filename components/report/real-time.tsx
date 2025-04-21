"use client"

import React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useOutlet } from "@/contexts/outlet-context"
import { getRealtimeStock } from "@/services/report-service"

export default function RealtimeStock() {
  const { currentOutlet } = useOutlet()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] =useState(false);

  const queryStock = getRealtimeStock(currentOutlet?.id || 1)
  const { data: stockData } = queryStock()

  const showProductDetail = (product) => {
    setSelectedProduct(product)
    setIsDetailOpen(true)
  }
  // const groupedStock = item.stock_by_type?.reduce((acc, stock) => {
  //   if (!acc[stock.type]) {
  //     acc[stock.type] = [];
  //   }
  //   acc[stock.type].push(stock);
  //   return acc;
  // }, {});

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stok Realtime</CardTitle>
          <CardDescription>
            Menampilkan stok saat ini untuk {currentOutlet ? currentOutlet.name : "semua outlet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              Error: {error.message}
            </div>
          ) : !stockData?.data ? (
            <div className="text-center py-4">Tidak ada data stok</div>
          ) : (
            <div className="space-y-6">
              {/* Kelompokkan produk berdasarkan jenis stok */}
              {Object.entries(
                stockData.data.reduce((acc, product) => {
                  product.stock_by_type?.forEach(stock => {
                    if (!acc[stock.type]) {
                      acc[stock.type] = {
                        name: stock.type === 'purchase' ? 'Pembelian' :
                              stock.type === 'sale' ? 'Penjualan' :
                              stock.type === 'adjustment' ? 'Penyesuaian' :
                              stock.type === 'other' ? 'Lainya' :
                              stock.type === 'shipment' ? 'Kiriman Pabrik' :
                              stock.type === 'transfer_in' ? 'Transfer Masuk' :
                              stock.type === 'transfer_out' ? 'Transfer Keluar' :
                              'Stock Opname',
                        products: []
                      };
                    }
                    acc[stock.type].products.push({
                      product,
                      stock
                    });
                  });
                  return acc;
                }, {})
              ).map(([type, group]) => (
                <div key={`stock-type-${type}`} className="border rounded-lg">
                  <div className="p-4 bg-gray-50">
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-gray-500">
                      {group.products.length} produk
                    </p>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-right">Stok Saat Ini</TableHead>
                        <TableHead className="text-right">Perubahan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.products.map(({product, stock}) => (
                        <TableRow key={`product-${product.id}-${stock.id}`}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.product.name}</p>
                              <p className="text-sm text-gray-500">{product.product.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.product.category.name}</TableCell>
                          <TableCell className="text-right">
                            {product.quantity} {product.product.unit}
                            <div className="text-xs text-gray-500">
                              Min: {product.min_stock}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={stock.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}>
                              {stock.quantity_change > 0 ? '+' : ''}{stock.quantity_change}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={stock.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-gray-100'}>
                              {stock.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(stock.created_at), "dd MMM yyyy HH:mm", { locale: id })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
              
              {/* Summary section */}
              {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Produk</p>
                    <p className="font-medium">{stockData.data.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stok Normal</p>
                    <p className="font-medium">
                      {stockData.data.filter(item => item.quantity >= item.min_stock).length}
                    </p>
                  </div> 
                  <div>
                    <p className="text-sm text-gray-500">Stok Rendah</p>
                    <p className="font-medium">
                      {stockData.data.filter(item => item.quantity < item.min_stock && item.quantity > 0).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stok Habis</p>
                    <p className="font-medium">
                      {stockData.data.filter(item => item.quantity === 0).length}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>

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
                  {selectedProduct.quantity < selectedProduct.min_stock && selectedProduct.quantity > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    >
                      Stok Rendah
                    </Badge>
                  )}
                  {selectedProduct.quantity === 0 && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                      Habis
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                  <p>{format(selectedProduct.updated_at, "PPP", { locale: id })}</p>
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
            <Button type="button" variant="secondary" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}