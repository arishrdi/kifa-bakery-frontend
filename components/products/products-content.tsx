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
import { getAllProductsByOutlet, createProduct, updateProduct, deleteProduct } from "@/services/product-service"
import { getAllCategories } from "@/services/category-service"
import { getAllOutlets } from "@/services/outlet-service"
import { Checkbox } from "../ui/checkbox"
import { Product, ProductInput } from "@/types/product"
import { createInventoryHistory } from "@/services/inventory-service"
import { InventoryInput } from "@/types/inventory"
import { toast } from "@/hooks/use-toast"
import { DataTable } from "../ui/data-table"
import { columns } from "./column"

export default function ProductsContent() {
  const { currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "list"

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)

  const postProduct = createProduct()
  const updProduct = updateProduct(selectedProduct?.id ?? 0)
  const delProduct = deleteProduct()
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
    } else {
      setPreviewImage(null)
      setFormData(prev => ({ ...prev, image: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('sku', formData.sku)
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }
    if (formData.description) {
      formDataToSend.append('description', formData.description)
    }
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
          toast({
            title: "Produk Berhasil Ditambahkan!",
            description: "Produk baru telah berhasil disimpan ke sistem.",
            variant: "default"
          })
        },
        onError: () => {
          toast({
            title: "Gagal Menyimpan Produk!",
            description: "Terjadi kesalahan saat mencoba menambahkan produk. Silakan cek inputan.",
            variant: "destructive"
          })
        }
      })
    } catch (error: any) {
      console.error('Error creating product:', error.message)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('sku', formData.sku);
    if (formData.description) {
      formDataToSend.append('description', formData.description);
    }
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category_id', formData.category_id.toString());
    formDataToSend.append('is_active', formData.is_active ? '1' : '0');
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('min_stock', formData.min_stock);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    formData.outlet_ids.forEach((id) => {
      formDataToSend.append('outlet_ids[]', id.toString());
    });

    try {
      updProduct.mutate(
        formDataToSend,
        {
          onSuccess: () => {
            setIsEditProductOpen(false);
            setFormData(initialFormData);
            setPreviewImage(null);
            refetchProducts();
            toast({
              title: "Perubahan Disimpan!",
              description: "Produk telah berhasil diperbarui.",
              variant: "default"
            })
          },
          onError: () => {
            toast({
              title: "Gagal Memperbarui Produk!",
              description: "Pembaruan produk tidak berhasil. Cek inputan atau koneksi internet.",
              variant: 'destructive'
            })
          }
        }
      );
    } catch (error: any) {
      console.error('Error updating product:', error.message);
    }
  };

  const handleEditClick = (product: Product) => {

    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku || '',
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category.id,
      image: null,
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
          setInventoryFormData(initialInventoryFormData)
          refetchProducts()
          toast({
            title: "Stok Berhasil Disesuaikan!",
            description: "Perubahan stok telah berhasil disimpan.",
            variant: "default"
          })
        },
        onError: () => {
          toast({
            title: "Gagal Menyesuaikan Stok!",
            description: "Terjadi kesalahan saat mencoba menyesuaikan stok.",
            variant: "destructive"
          })
        }
      }
    )
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteProduct = () => {
    if (!selectedProduct) return

    delProduct.mutate(selectedProduct.id, {
      onSuccess: () => {
        refetchProducts();
        setIsDeleteDialogOpen(false)
        toast({
          title: "Produk Berhasil Dihapus!",
          description: "Produk telah berhasil dihapus dari sistem.",
          variant: "default"
        })
      },
      onError: () => {
        toast({
          title: "Gagal Menghapus Produk!",
          description: "Terjadi kesalahan saat mencoba menghapus produk. Silakan coba lagi.",
          variant: "destructive"
        })
      }
    });
  }

  const handleAdjustStockClick = (product: Product) => {
    setSelectedProduct(product)
    setInventoryFormData({
      ...initialInventoryFormData,
      product_id: product.id
    })
    setIsAdjustStockDialogOpen(true)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{isEditProductOpen ? "Edit Produk" : "Manajemen Produk"}</h2>
        <div className="flex items-center space-x-2">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="w-[200px] pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}

          <Dialog
            open={isAddProductOpen || isEditProductOpen}
            onOpenChange={(open) => {
              if (!open) {
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
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Contoh: Es Kopi Susu"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU Produk</Label>
                        <Input
                          id="sku"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          placeholder="Kode unik produk (opsional)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi Produk</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Deskripsi singkat tentang produk... (opsional)"
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: Harga & Kategori */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Harga & Kategori</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Harga Jual</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                          <Input
                            id="price"
                            name="price"
                            type="text"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category_id">Kategori</Label>
                        <Select
                          value={formData.category_id.toString()}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: parseInt(value) }))}
                          required
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
                        <Label htmlFor="quantity">Stok Awal</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="text"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min_stock">Stok Minimum</Label>
                        <Input
                          id="min_stock"
                          name="min_stock"
                          type="text"
                          value={formData.min_stock}
                          onChange={handleInputChange}
                          required
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
                            id={`outlet-${outlet.id}`}
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
                          Format: JPEG/PNG (opsional)
                          <br />
                          Maks. 2MB
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="image">Upload Gambar</Label>
                          <Input
                            id="image"
                            type="file"
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

          {products?.data && <DataTable columns={columns} data={products?.data} onDelete={handleDeleteClick} onEdit={handleEditClick} />}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedProduct && (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-orange-100 flex items-center justify-center">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-xs text-muted-foreground">
                    SKU: {selectedProduct.sku || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
            >
              Hapus Produk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}