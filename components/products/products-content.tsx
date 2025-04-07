"use client"

import type React from "react"
import { ChangeEvent, useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Store, Cake, MoreHorizontal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAllProductsByOutlet, createProduct } from "@/services/product-service"
import { getAllCategories } from "@/services/category-service"
import { getAllOutlets } from "@/services/outlet-service"
import { Checkbox } from "../ui/checkbox"
import { Product, ProductInput } from "@/types/product"
import { createInventoryHistory } from "@/services/inventory-service"
import { InventoryInput } from "@/types/inventory"

export default function ProductsContent() {
  const { currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "list"

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)

  const postProduct = createProduct()
  const postInventoryHistory = createInventoryHistory()

  const initialFormData: ProductInput = {
    name: '',
    sku: '',
    description: '',
    price: '',
    category_id: 0,
    image: null,
    is_active: true,
    outlet_ids: [],
    quantity: '',
    min_stock: '',
  }

  const initialInventoryFormData: InventoryInput = {
    outlet_id: currentOutlet?.id || 0,
    product_id: 0,
    quantity_change: '',
    type: "adjustment",
    notes: ""
  }

  const [formData, setFormData] = useState<ProductInput>(initialFormData)
  const [inventoryFormData, setInventoryFormData] = useState<InventoryInput>(initialInventoryFormData)

  const query = getAllProductsByOutlet(currentOutlet?.id || 0)
  const { data: products, refetch: refetchProducts } = query()
  const { data: categories } = getAllCategories()
  const { data: outlets } = getAllOutlets()

  const handleNumericInput = (name: any, value: string) => {
    const cleanedValue = value.replace(/[^-0-9]/g, '');

    if (cleanedValue === '-' || cleanedValue === '') {
      return '';
    }

    const processedValue = cleanedValue.startsWith('-')
      ? '-' + cleanedValue.replace(/-/g, '')
      : cleanedValue;

    return parseInt(processedValue, 10).toString();
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'quantity' || name === 'min_stock' || name === 'quantity_change') {
      setFormData(prev => ({
        ...prev,
        [name]: handleNumericInput(name, value)
      }));

      setInventoryFormData(prev => ({
        ...prev,
        [name]: handleNumericInput(name, value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      setInventoryFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (outletId: number) => {
    setFormData(prev => {
      const outletIds = prev.outlet_ids.includes(outletId)
        ? prev.outlet_ids.filter(id => id !== outletId)
        : [...prev.outlet_ids, outletId]
      return { ...prev, outlet_ids: outletIds }
    })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('sku', formData.sku)
    formDataToSend.append('image', formData.image)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('category_id', formData.category_id.toString())
    formDataToSend.append('is_active', formData.is_active ? '1' : '0');
    formDataToSend.append('quantity', formData.quantity.toString())
    formDataToSend.append('min_stock', formData.min_stock.toString())
    formData.outlet_ids.forEach((id) => {
      formDataToSend.append('outlet_ids[]', id.toString());
    });

    try {
      postProduct.mutate(formDataToSend, {
        onSuccess: () => {
          setIsAddProductOpen(false)
          setFormData(initialFormData)
          setPreviewImage(null)
          refetchProducts()
        }
      })
      console.log('FormData:', Object.fromEntries(formDataToSend))

    } catch (error: any) {
      console.error('Error creating product:', error.message)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT'); // Untuk Laravel API
      formDataToSend.append('name', formData.name);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category_id', formData.category_id.toString());
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('min_stock', formData.min_stock);

      // Handle image update
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      formData.outlet_ids.forEach((id) => {
        formDataToSend.append('outlet_ids[]', id.toString());
      });

      // try {
      //   updateProductMutation.mutate(
      //     { id: selectedProduct.id, data: formDataToSend },
      //     {
      //       onSuccess: () => {
      //         setIsEditProductOpen(false);
      //         setFormData(initialFormData);
      //         setPreviewImage(null);
      //         refetchProducts();
      //       }
      //     }
      //   );
      // } catch (error: any) {
      //   console.error('Error updating product:', error.message);
      // }
    };
    console.log("edit", selectedProduct)
  }

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku || '',
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category.id,
      image: null, // Tetap null karena kita akan handle file terpisah
      is_active: product.is_active,
      outlet_ids: product.outlets.map(outlet => outlet.id),
      quantity: product.quantity.toString(),
      min_stock: product.min_stock.toString()
    });
    setPreviewImage(product.image || null);
    setIsEditProductOpen(true);
  };

  const handleAdjustStockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
          setIsAdjustStockDialogOpen(false)
          refetchProducts()
        }
      }
    )

    console.log("adjust stock", selectedProduct)
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleAdjustStockClick = (product: Product) => {
    setSelectedProduct(product)
    setIsAdjustStockDialogOpen(true)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{isEditProductOpen ? "Edit Produk" : "Manajemen Produk"}</h2>
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

          <Dialog
            open={isAddProductOpen || isEditProductOpen}
            onOpenChange={(open) => {
              if (!open) {
                // Reset form saat dialog ditutup
                setFormData(initialFormData)
                setPreviewImage(null)
              }
              if (isEditProductOpen) {
                setIsEditProductOpen(open)
              } else {
                setIsAddProductOpen(open)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> {isEditProductOpen ? "Edit Produk" : "Tambah Produk"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{isEditProductOpen ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isEditProductOpen ? "Edit informasi produk" : "Lengkapi informasi produk baru untuk menambahkannya ke katalog"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={isEditProductOpen ? handleEditSubmit : handleSubmit} encType="multipart/form-data">
                <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Section 1: Informasi Dasar */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Informasi Dasar</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label >Nama Produk</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Contoh: Es Kopi Susu"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SKU Produk</Label>
                        <Input
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          placeholder="Kode unik produk (opsional)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Deskripsi Produk</Label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Deskripsi singkat tentang produk..."
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: Harga & Kategori */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Harga & Kategori</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Harga Jual</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                          <Input
                            name="price"
                            type="text"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Kategori</Label>
                        <Select
                          value={formData.category_id.toString()}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.data.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Manajemen Stok */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Manajemen Stok</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Stok Awal</Label>
                        <Input
                          name="quantity"
                          type="text"
                          value={formData.quantity}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label >Stok Minimum</Label>
                        <Input
                          name="min_stock"
                          type="text"
                          value={formData.min_stock}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Distribusi Outlet */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Distribusi Outlet</h3>
                    <div className="grid grid-cols-2 gap-4 max-h-[200px] overflow-y-auto">
                      {outlets?.data.map((outlet) => (
                        <div key={outlet.id} className="flex items-center gap-3">
                          <Checkbox
                            checked={formData.outlet_ids.includes(outlet.id)}
                            onCheckedChange={() => handleCheckboxChange(outlet.id)}
                          />

                          <Label htmlFor={`outlet-${outlet.id}`} className="flex-1">
                            <div className="font-medium">{outlet.name}</div>
                            <div className="text-xs text-muted-foreground">{outlet.address}</div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Gambar Produk */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Gambar Produk</h3>
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative h-32 w-32 rounded-lg border-2 border-dashed bg-background">
                          {isEditProductOpen ? (
                            previewImage ? (
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="h-full w-full rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Cake className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Cake className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground text-center">
                          Format: JPEG/PNG
                          <br />
                          Maks. 2MB
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <Label>Upload Gambar</Label>
                          <Input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file:text-foreground file:bg-transparent file:border-0"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                          />
                          <Label htmlFor="is_active" className="flex flex-col gap-1">
                            <span>Status Aktif</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              Produk akan muncul di katalog jika diaktifkan
                            </span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddProductOpen(false)
                      setIsEditProductOpen(false)
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4" />
                    {isEditProductOpen ? "Simpan Perubahan" : "Tambah Produk"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAdjustStockDialogOpen} onOpenChange={setIsAdjustStockDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sesuaikan Stok</DialogTitle>
                <DialogDescription>
                  Sesuaikan stok produk untuk outlet yang dipilih
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdjustStockSubmit}>
                <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
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
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Penyesuaian Stok</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nilai + / -</Label>
                        <Input
                          type="number"
                          name="quantity_change"
                          value={inventoryFormData.quantity_change}
                          onChange={handleInputChange}
                          placeholder="Masukkan nilai penambahan/pengurangan"
                          onKeyPress={(e) => {
                            // Izinkan tanda minus hanya di awal atau untuk bilangan negatif
                            if (e.key === '-' && e.currentTarget.value.includes('-')) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipe</Label>
                        <Select
                          value={inventoryFormData.type}
                          onValueChange={(value) => setInventoryFormData(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sale">Penjualan</SelectItem>
                            <SelectItem value="purchase">Pembelian</SelectItem>
                            <SelectItem value="adjustment">Penyesuaian</SelectItem>
                            <SelectItem value="other">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Keterangan</Label>
                        <Textarea
                          name="notes"
                          value={inventoryFormData.notes}
                          onChange={handleInputChange}
                          placeholder="Masukkan keterangan (opsional)"
                        />
                      </div>
                    </div>
                  </div>

                </div>
                <DialogFooter className="border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdjustStockDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="gap-2 bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4" />
                    Sesuaikan Stok
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {currentOutlet && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>Menampilkan produk untuk: {currentOutlet.name}</AlertTitle>
          <AlertDescription>Data produk yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
        </Alert>
      )}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { handleEditClick(product); setIsEditProductOpen(true) }}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-orange-500" onClick={() => handleAdjustStockClick(product)}>
                          <Plus className="mr-2 h-4 w-4" /> Sesuaikan Stok
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(product)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
    </div>

  )
}