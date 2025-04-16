"use client"

import { useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Truck, Store } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAllProductsByOutlet } from "@/services/product-service"
import { getAllOutlets } from "@/services/outlet-service"
import { Product } from "@/types/product"
import { toast } from "@/hooks/use-toast"
import { getCookie } from "cookies-next"

export default function TransferStokContent() {
  const { currentOutlet } = useOutlet()
  const [searchQuery, setSearchQuery] = useState("")
  const [isTransferStockDialogOpen, setIsTransferStockDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const query = getAllProductsByOutlet(currentOutlet?.id || 0)
  const { data: products, refetch: refetchProducts } = query()
  const { data: outlets } = getAllOutlets()

  // Add this state for the transfer form data
  const initialTransferFormData = {
    product_id: 0,
    source_outlet_id: currentOutlet?.id || 0,
    destination_outlet_id: 0,
    quantity: '',
    notes: '',
  }

  const token = getCookie("access_token")
  const [transferFormData, setTransferFormData] = useState(initialTransferFormData)

  // Handle transfer form input changes
  const handleTransferInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'quantity') {
      setTransferFormData(prev => ({
        ...prev,
        [name]: handleNumericInput(name, value)
      }))
    } else {
      setTransferFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Function to handle numeric input
  const handleNumericInput = (name: any, value: string) => {
    const cleanedValue = value.replace(/[^-0-9]/g, '')

    if (cleanedValue === '-' || cleanedValue === '') {
      return ''
    }

    const processedValue = cleanedValue.startsWith('-')
      ? '-' + cleanedValue.replace(/-/g, '')
      : cleanedValue

    return parseInt(processedValue, 10).toString()
  }

  // Function to handle transfer stock click
  const handleTransferStockClick = (product) => {
    setSelectedProduct(product)
    setTransferFormData({
      ...initialTransferFormData,
      product_id: product.id,
      source_outlet_id: currentOutlet?.id || 0,
    })
    setIsTransferStockDialogOpen(true)
  }

  // Function to validate transfer quantity
  const isValidTransferQuantity = () => {
    if (!transferFormData.quantity) return false
    
    const requestedQuantity = parseInt(transferFormData.quantity)
    const availableQuantity = selectedProduct?.quantity || 0
    
    return requestedQuantity > 0 && requestedQuantity <= availableQuantity
  }

  // Function to handle form submission
  const handleTransferStockSubmit = (e) => {
    e.preventDefault()

    if (!isValidTransferQuantity()) {
      toast({ 
        title: "Validasi Gagal!", 
        description: "Jumlah transfer tidak boleh melebihi stok tersedia.", 
        variant: "destructive" 
      })
      return
    }
    
    // Use the proper API URL - make sure this is the correct path to your backend
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/inventories/transfer`

    const payload = {
      product_id: transferFormData.product_id,
      source_outlet_id: transferFormData.source_outlet_id,
      target_outlet_id: transferFormData.destination_outlet_id,
      quantity: parseInt(transferFormData.quantity),
      user_id: 1, // Replace with actual user ID from auth context
      notes: transferFormData.notes
    }
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Server error')
          })
        } else {
          throw new Error('Network error - server might be down')
        }
      }
      return response.json()
    })
    .then(data => {
      toast({ 
        title: "Transfer Berhasil!", 
        description: "Stok berhasil ditransfer ke outlet tujuan." 
      })
      setIsTransferStockDialogOpen(false)
      refetchProducts()
    })
    .catch(error => {
      toast({ 
        title: "Transfer Gagal!", 
        description: error.message || "Terjadi kesalahan saat transfer stok.", 
        variant: "destructive" 
      })
      console.error("Error transferring stock:", error)
    })
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">Rp {product.price.toLocaleString()}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-medium ${product.quantity <= product.min_stock ? "text-orange-600" : ""}`}>
                      {product.quantity}
                    </div>
                    <div className="text-xs text-muted-foreground">Min: {product.min_stock}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        product.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {product.is_active ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 bg-orange-600 text-white hover:bg-orange-700 hover:text-white" 
                      onClick={() => handleTransferStockClick(product)}
                    >
                      <Truck className="h-4 w-4" /> Transfer Stok
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {products?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada produk yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transfer Stock Dialog */}
      <Dialog open={isTransferStockDialogOpen} onOpenChange={setIsTransferStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Stok</DialogTitle>
            <DialogDescription>
              Transfer stok produk dari outlet ini ke outlet lain
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransferStockSubmit}>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
              {/* Product Information */}
              <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                <h3 className="font-medium text-base">Informasi Produk</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Produk</Label>
                    <Input
                      type="text"
                      value={selectedProduct?.name}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stok Saat Ini</Label>
                    <Input
                      type="number"
                      value={selectedProduct?.quantity}
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              {/* Transfer Details */}
              <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                <h3 className="font-medium text-base">Detail Transfer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Outlet Asal</Label>
                    <Input
                      type="text"
                      value={currentOutlet?.name || ''}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Outlet Tujuan</Label>
                    <Select
                      value={transferFormData.destination_outlet_id.toString()}
                      onValueChange={(value) => setTransferFormData(prev => ({ 
                        ...prev, 
                        destination_outlet_id: parseInt(value)
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih outlet tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets?.data.filter(outlet => outlet.id !== currentOutlet?.id).map((outlet) => (
                          <SelectItem key={outlet.id} value={outlet.id.toString()}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{outlet.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jumlah Transfer</Label>
                    <Input
                      type="text"
                      name="quantity"
                      value={transferFormData.quantity}
                      onChange={handleTransferInputChange}
                      placeholder="Masukkan jumlah stok yang ditransfer"
                      className={!isValidTransferQuantity() && transferFormData.quantity ? "border-red-500" : ""}
                    />
                    {transferFormData.quantity && !isValidTransferQuantity() && (
                      <p className="text-xs text-red-500">
                        Jumlah transfer tidak valid. Stok tersedia: {selectedProduct?.quantity}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Stok tersedia: {selectedProduct?.quantity}
                    </p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Keterangan</Label>
                    <Textarea
                      name="notes"
                      value={transferFormData.notes}
                      onChange={handleTransferInputChange}
                      placeholder="Masukkan keterangan transfer (opsional)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTransferStockDialogOpen(false)}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="gap-2 bg-orange-600 hover:bg-orange-700"
                disabled={!transferFormData.destination_outlet_id || !isValidTransferQuantity()}
              >
                <Truck className="h-4 w-4" />
                Transfer Stok
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}