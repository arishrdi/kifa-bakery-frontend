"use client"

import React, { ChangeEvent, useEffect } from "react"
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
import { getInventoryHistoryByType } from "@/services/report-service"
import { Input } from "../ui/input"
import { DateRangePicker } from "../ui/date-range-picker"
import { ScrollArea } from "../ui/scroll-area"

type RealtimeStockProps = {
  dateRange: {
    from: Date;
    to: Date;
  },
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date;
    to: Date;
  }>>
}

export default function RealtimeStock({ dateRange, setDateRange }: RealtimeStockProps) {
  const { currentOutlet } = useOutlet()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const queryHistoryStock = getInventoryHistoryByType({
    outletId: currentOutlet?.id || 1,
    dateRange: {
      start_date: format(dateRange.from, 'yyyy-MM-dd'),
      end_date: format(dateRange.to, 'yyyy-MM-dd'),
    },
  })

  const { data: historyStockData, refetch } = queryHistoryStock()

  const handleDateRangeChange = (newValue: { from: Date, to: Date }) => {
    if (!newValue) return

    const { from, to } = newValue

    if (from && to && from > to) {
      setDateRange({ from, to: from })
    } else if (!to) {
      setDateRange({ from, to: from })
    } else {
      setDateRange(newValue)
    }

    refetch()
  }

  const [filteredInventoryData, setFilteredInventoryData] = useState({
    adjustment: { products: [] },
    shipment: { products: [] },
    purchase: { products: [] },
    sale: { products: [] }
  })

  const handleProductsSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase()

    const filteredData = {
      adjustment: {
        ...historyStockData?.data.summary_by_type.adjustment,
        products: historyStockData?.data.summary_by_type.adjustment.products?.filter(
          product => product.product_name.toLowerCase().includes(searchTerm)
        )
      },
      shipment: {
        ...historyStockData?.data.summary_by_type.shipment,
        products: historyStockData?.data.summary_by_type.shipment.products?.filter(
          product => product.product_name.toLowerCase().includes(searchTerm)
        )
      },
      purchase: {
        ...historyStockData?.data.summary_by_type.purchase,
        products: historyStockData?.data.summary_by_type.purchase.products?.filter(
          product => product.product_name.toLowerCase().includes(searchTerm)
        )
      },
      sale: {
        ...historyStockData?.data.summary_by_type.sale,
        products: historyStockData?.data.summary_by_type.sale.products?.filter(
          product => product.product_name.toLowerCase().includes(searchTerm)
        )
      }
    };


    setFilteredInventoryData(filteredData)
  }

  const openDetailModal = (product: any) => {
    setSelectedProduct(product)
    setIsDetailOpen(true)
  }

  useEffect(() => {
    if (historyStockData?.data) {
      setFilteredInventoryData({
        adjustment: historyStockData.data.summary_by_type.adjustment,
        shipment: historyStockData.data.summary_by_type.shipment,
        purchase: historyStockData.data.summary_by_type.purchase,
        sale: historyStockData.data.summary_by_type.sale
      })
    }
  }, [historyStockData])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Stok</CardTitle>
          <CardDescription>
            Menampilkan riwayat stok saat ini untuk {currentOutlet ? currentOutlet.name : "semua outlet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            <Input placeholder="Cari Produk" className="w-80 mb-4" onChange={handleProductsSearch} />
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              Error: {error.message}
            </div>
          ) : !historyStockData?.data ? (
            <div className="text-center py-4">Tidak ada data stok</div>
          ) : (
            <div className="space-y-6">
              {Object.entries({
                adjustment: {
                  name: "Penyesuaian",
                  data: filteredInventoryData.adjustment
                },
                shipment: {
                  name: "Kiriman Pabrik",
                  data: filteredInventoryData.shipment
                },
                purchase: {
                  name: "Pembelian",
                  data: filteredInventoryData.purchase
                },
                sale: {
                  name: "Penjualan",
                  data: filteredInventoryData.sale
                }
              }).map(([type, group]) => (
                <div key={`stock-type-${type}`} className="border rounded-lg">
                  <div className="p-4 bg-gray-50">
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-gray-500">
                      {group?.data?.products?.length || 0} produk
                    </p>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Stok Akhir Periode</TableHead>
                        <TableHead className="text-right">Total Perubahan</TableHead>
                        <TableHead className="text-right">Total Entri</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group?.data?.products?.map((product) => (
                        <TableRow key={`product-${product.product_id}`}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.product_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell className="text-right">
                            {product.stock_as_of_end_date} {product.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={product.total_quantity_changed > 0 ? 'text-green-600' : 'text-red-600'}>
                              {product.total_quantity_changed > 0 ? '+' : ''}{product.total_quantity_changed}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {product.total_entries}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailModal(product)}
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Riwayat Stok</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai riwayat stok produk
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(80vh-180px)] pr-4">
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Produk</p>
                    <p className="font-medium">{selectedProduct.product_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p>{selectedProduct.sku || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stok Akhir Periode</p>
                    <p className="font-medium">{selectedProduct.stock_as_of_end_date} {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Perubahan</p>
                    <p className={selectedProduct.total_quantity_changed > 0 ? 'text-green-600' : 'text-red-600'}>
                      {selectedProduct.total_quantity_changed > 0 ? '+' : ''}{selectedProduct.total_quantity_changed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Entri</p>
                    <p>{selectedProduct.total_entries}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Detail Entri</h4>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead className="text-right">Stok Sebelum</TableHead>
                          <TableHead className="text-right">Stok Sesudah</TableHead>
                          <TableHead className="text-right">Perubahan</TableHead>
                          <TableHead>Catatan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProduct.entries?.map((entry: any) => (
                          <TableRow key={`entry-${entry.id}`}>
                            <TableCell>
                              {format(new Date(entry.created_at), "dd MMM yyyy HH:mm", { locale: id })}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.quantity_before}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.quantity_after}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={entry.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}>
                                {entry.quantity_change > 0 ? '+' : ''}{entry.quantity_change}
                              </span>
                            </TableCell>
                            <TableCell>
                              {entry.notes || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

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