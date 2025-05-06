"use client"

import { useState, useEffect } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, ArrowRight, RefreshCw, Store } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { getAllProductsByOutlet } from "@/services/product-service"
import { toast } from "@/hooks/use-toast"
import { createInventoryHistory } from "@/services/inventory-service"
import { InventoryInput } from "@/types/inventory"

export default function AdjustmentContent({search}: {search: string}) {
  const { currentOutlet } = useOutlet()
  // const [searchQuery, setSearchQuery] = useState("")
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productTypeMap, setProductTypeMap] = useState<{ [key: number]: string }>({})

  const initialInventoryFormData: InventoryInput = {
    outlet_id: currentOutlet?.id || 0,
    product_id: 0,
    quantity_change: '',
    type: "adjustment",
    notes: ""
  }

  const [inventoryFormData, setInventoryFormData] = useState<InventoryInput>(initialInventoryFormData)

  const postInventoryHistory = createInventoryHistory()
  const productsQuery = getAllProductsByOutlet(currentOutlet?.id || 0)
  const { data: products, refetch: refetchProducts } = productsQuery()

  // Load product types from localStorage on initial render
  useEffect(() => {
    const outletId = currentOutlet?.id;
    if (outletId) {
      const storedTypesString = localStorage.getItem(`productTypes_${outletId}`);
      if (storedTypesString) {
        try {
          const storedTypes = JSON.parse(storedTypesString);
          setProductTypeMap(storedTypes);
        } catch (error) {
          console.error("Failed to parse product types from localStorage", error);
        }
      }
    }
  }, [currentOutlet?.id]);

  // Save product types to localStorage whenever productTypeMap changes
  useEffect(() => {
    const outletId = currentOutlet?.id;
    if (outletId && Object.keys(productTypeMap).length > 0) {
      localStorage.setItem(`productTypes_${outletId}`, JSON.stringify(productTypeMap));
    }
  }, [productTypeMap, currentOutlet?.id]);

  const handleNumericInput = (value: string) => {
    if (value === '' || value === '-') {
      return value;
    }

    const cleanedValue = value.replace(/[^0-9-]/g, '');
    const isNegative = cleanedValue.startsWith('-');
    const digitsOnly = cleanedValue.replace(/-/g, '');

    return isNegative ? '-' + digitsOnly : digitsOnly;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'quantity_change') {
      setInventoryFormData(prev => ({
        ...prev,
        [name]: handleNumericInput(value)
      }));
    } else {
      setInventoryFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  const handleQuantityChange = (value: string) => {
    const numericValue = handleNumericInput(value);
    let suggestedType = inventoryFormData.type;

    if (selectedProduct?.id && productTypeMap[selectedProduct.id]) {
      suggestedType = productTypeMap[selectedProduct.id];
    }

    if (numericValue.startsWith('-')) {
      suggestedType = 'sale';
    } else if (numericValue !== '' && !numericValue.startsWith('-')) {
      suggestedType = 'purchase';
    }

    setInventoryFormData(prev => ({
      ...prev,
      quantity_change: numericValue,
      type: suggestedType
    }));
  }

  const handleAdjustStock = (product: any) => {
    setSelectedProduct(product)
    const currentType = productTypeMap[product.id] || "adjustment";

    setInventoryFormData({
      outlet_id: currentOutlet?.id || 0,
      product_id: product.id,
      quantity_change: '',
      type: currentType,
      notes: ""
    })

    setIsAdjustDialogOpen(true)
  }

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      "sale": "Penjualan",
      "purchase": "Pembelian",
      "adjustment": "Penyesuaian",
      "shipment": "Kiriman Pabrik",
      "other": "Lainnya"
    };

    return typeLabels[type as keyof typeof typeLabels] || type;
  }

  const getTypeColor = (type: string) => {
    const typeColors = {
      "sale": "text-red-600 bg-red-50 dark:bg-red-900/20",
      "purchase": "text-green-600 bg-green-50 dark:bg-green-900/20",
      "adjustment": "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
      "other": "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
    };

    return typeColors[type as keyof typeof typeColors] || "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
  }

  const handleAdjustStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      postInventoryHistory.mutate(
        {
          outlet_id: currentOutlet?.id || 0,
          product_id: selectedProduct.id,
          quantity_change: inventoryFormData.quantity_change,
          type: inventoryFormData.type,
          notes: inventoryFormData.notes
        },
        {
          onSuccess: () => {
            setProductTypeMap(prev => {
              const updatedMap = {
                ...prev,
                [selectedProduct.id]: inventoryFormData.type
              };

              if (currentOutlet?.id) {
                localStorage.setItem(`productTypes_${currentOutlet.id}`, JSON.stringify(updatedMap));
              }

              return updatedMap;
            });

            setIsAdjustDialogOpen(false)
            setInventoryFormData(initialInventoryFormData)
            refetchProducts()
            toast({
              title: "Stok Berhasil Disesuaikan!",
              description: "Perubahan stok telah berhasil disimpan.",
              variant: "default"
            })
            setIsSubmitting(false)
          },
          onError: () => {
            toast({
              title: "Gagal Menyesuaikan Stok!",
              description: "Terjadi kesalahan saat mencoba menyesuaikan stok.",
              variant: "destructive"
            })
            setIsSubmitting(false)
          }
        }
      )
    } catch (error) {
      toast({
        title: "Gagal menyimpan penyesuaian",
        description: "Terjadi kesalahan saat menyimpan perubahan stok.",
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }

  const getProductType = (product: any) => {
    if (productTypeMap[product.id]) {
      return productTypeMap[product.id];
    }
    return "adjustment";
  }

  return (
    // <div className="flex flex-col space-y-4 p-2 sm:p-4 md:p-6">
      <div>
      <div className="space-y-4 overflow-x-auto bg-white dark:bg-gray-900 rounded-lg">

        <div className="border rounded-lg overflow-hidden shadow-sm min-w-[300px]">
          <Table className="min-w-full">
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[40%] sm:w-[50%] px-2 sm:px-4 py-2">Produk</TableHead>
                <TableHead className="text-center whitespace-nowrap px-2 sm:px-4 py-2">Tipe</TableHead>
                <TableHead className="text-right whitespace-nowrap px-2 sm:px-4 py-2">Stok</TableHead>
                <TableHead className="text-right px-2 sm:px-4 py-2">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.data
                .filter(product =>
                  product.name.toLowerCase().includes(search) ||
                  product.sku?.toLowerCase().includes(search)
                )
                .map((product) => (
                  <TableRow key={product.id} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/10">
                    <TableCell className="py-2 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm sm:text-base truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {product.sku || 'Tanpa SKU'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-2 sm:py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(getProductType(product))}`}>
                        {getTypeLabel(getProductType(product))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2 sm:py-4">
                      <div className={`font-medium text-sm sm:text-base ${product.quantity <= 0 ? 'text-red-500' : ''}`}>
                        {product.quantity}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-2 sm:py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdjustStock(product)}
                        className="group border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-700 dark:hover:text-white transition-colors"
                      >
                        <span className="sr-only sm:not-sr-only sm:inline">Sesuaikan</span>
                        <ArrowRight className="h-4 w-4 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Sesuaikan Stok
            </DialogTitle>
            <DialogDescription>
              Sesuaikan stok untuk produk: <span className="font-medium ">{selectedProduct?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustStockSubmit}>
            <div className="grid gap-4 sm:gap-6 py-4">
              <div className="space-y-4 p-3 sm:p-4 rounded-lg border ">
                <h3 className="font-medium text-sm sm:text-base ">Informasi Produk</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Nama Produk</Label>
                    <Input
                      type="text"
                      value={selectedProduct?.name}
                      disabled
                      className="bg-white dark:bg-gray-800 h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Stok Saat Ini</Label>
                    <Input
                      type="text"
                      value={selectedProduct?.quantity}
                      disabled
                      className="bg-white dark:bg-gray-800 h-9 sm:h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-3 sm:p-4 rounded-lg border">
                <h3 className="font-medium text-sm sm:text-base ">Penyesuaian Stok</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity_change" className="text-sm sm:text-base">Nilai + / -</Label>
                    <Input
                      id="quantity_change"
                      type="text"
                      name="quantity_change"
                      value={inventoryFormData.quantity_change}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      placeholder="Masukkan nilai +10 atau -5"
                      required
                      className="bg-white dark:bg-gray-800 h-9 sm:h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      {inventoryFormData.quantity_change.startsWith('-')
                        ? 'Nilai negatif akan mengurangi stok'
                        : inventoryFormData.quantity_change
                          ? 'Nilai positif akan menambah stok'
                          : 'Masukkan nilai dengan tanda - jika mengurangi stok'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm sm:text-base">Tipe</Label>
                    <Select
                      value={inventoryFormData.type}
                      onValueChange={(value) => setInventoryFormData(prev => ({ ...prev, type: value }))}
                      required
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 h-9 sm:h-10">
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Penjualan</SelectItem>
                        <SelectItem value="purchase">Pembelian</SelectItem>
                        <SelectItem value="adjustment">Penyesuaian</SelectItem>
                        <SelectItem value="shipment">Kiriman Pabrik</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes" className="text-sm sm:text-base">Keterangan</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={inventoryFormData.notes}
                      onChange={handleInputChange}
                      placeholder="Masukkan keterangan (opsional)"
                      className="bg-white dark:bg-gray-800 min-h-[80px] sm:min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-3 sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdjustDialogOpen(false)}
                className="border-gray-300 dark:border-gray-600 h-9 sm:h-10"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-sm sm:text-base">Memproses...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm sm:text-base">Sesuaikan Stok</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}