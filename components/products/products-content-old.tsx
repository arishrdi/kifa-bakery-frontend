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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Store, Cake, Coffee, Pizza, Upload, MoreHorizontal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllProductsByOutlet } from "@/services/product-service"
import { getAllCategories } from "@/services/category-service"
import { getAllOutlets } from "@/services/outlet-service"
import { Checkbox } from "../ui/checkbox"
import { ProductInput } from "@/types/product"

export default function ProductsContent() {
  const { currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "list"

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    description: "",
    isActive: true,
    outlet: "Semua Outlet",
  })

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: 0,
    category_id: '',
    image: null,
    is_active: false,
    outlet_ids: [],
    quantity: 0,
    min_stock: 0,
  });

  const query = getAllProductsByOutlet(currentOutlet?.id || 0)
  const { data: products, isLoading, refetch: refetchProducts } = query()
  const { data: categories } = getAllCategories()
  const { data: outlets } = getAllOutlets()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setNewProduct((prev) => ({ ...prev, isActive: checked }))
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    // const productToAdd = {
    //   // id: products.length + 1,
    //   name: newProduct.name,
    //   sku: newProduct.sku,
    //   category: newProduct.category,
    //   price: Number.parseInt(newProduct.price),
    //   // cost: Number.parseInt(newProduct.cost),
    //   stock: Number.parseInt(newProduct.stock),
    //   minStock: Number.parseInt(newProduct.minStock),
    //   description: newProduct.description,
    //   isActive: newProduct.isActive,
    //   image: newProduct.image,
    //   outlet: newProduct.outlet,
    // }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof ProductInput];
      if (key === 'outlet_ids') {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key === 'image' && value instanceof File) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    console.log(formDataToSend)

    // setIsAddProductOpen(false)
    // resetForm()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === 'image' && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'outlet_ids') {
      setFormData({ ...formData, [name]: value.split(',').map(Number) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      description: product.description,
      isActive: product.isActive,
      outlet: product.outlet,
    })
    setIsEditProductOpen(true)
  }

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setIsEditProductOpen(false)
    resetForm()
  }

  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleAdjustStockClick = (product: any) => {
    setSelectedProduct(product)
    setIsAdjustStockDialogOpen(true)
  }

  const handleDeleteProduct = () => {

  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Buat URL sementara untuk preview gambar
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      price: "",
      cost: "",
      stock: "",
      minStock: "",
      description: "",
      isActive: true,
      outlet: "Semua Outlet",
    })
    setSelectedProduct(null)
  }


  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Produkasdsa</h2>
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
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> Tambah Produkasdsa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah Produk Baru</DialogTitle>
                <DialogDescription>Isi detail produk baru di bawah ini. Klik simpan setelah selesai.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} encType="multipart/form-data">
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">SKU</Label>
                      <Input id="name" name="sku" value={newProduct.sku} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Harga Jual (Rp)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.data
                            .map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stok</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Stok Minimum</Label>
                      <Input
                        id="minStock"
                        name="minStock"
                        type="number"
                        value={newProduct.minStock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outlet">Outlet</Label>
                    <div className="flex gap-2 flex-col">
                      {outlets?.data.map((outlet) => (
                        <div key={outlet.id} className="flex items-center gap-2">
                          <Checkbox id={outlet.id.toString()} name="outlet_ids[]" value={outlet.id.toString()} onChange={(e) => handleSelectChange("outlet_ids", e.currentTarget.value)} />
                          <Label htmlFor={outlet.id.toString()}>{outlet.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Gambar Produk</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-md border bg-muted flex items-center justify-center">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-20 w-20 rounded-md object-cover"
                          />
                        ) : (
                          <Cake className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <label htmlFor="image">
                      </label>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        className=""
                        accept="image/*"
                        onChange={handleImageChange} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" checked={newProduct.isActive} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="isActive">Produk Aktif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Simpan
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
        <CardHeader className="pb-3">
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Kelola produk yang tersedia di toko Anda</CardDescription>
          {/* <Tabs defaultValue="Semua" className="w-full">
            <TabsList className="mb-4 flex h-auto flex-wrap justify-start rounded-none border-b bg-transparent p-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs> */}
        </CardHeader>
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
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-orange-500" onClick={() => handleDeleteClick(product)}>
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

      {/* Edit Product Dialog */}
      {/* <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>Ubah detail produk di bawah ini. Klik simpan setelah selesai.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Produk</Label>
                  <Input id="edit-name" name="name" value={newProduct.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Kategori</Label>
                  <Select value={newProduct.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.data
                        // .filter((c) => c !== "Semua")
                        .map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Harga Jual (Rp)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Harga Modal (Rp)</Label>
                  <Input
                    id="edit-cost"
                    name="cost"
                    type="number"
                    value={newProduct.cost}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stok</Label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Stok Minimum</Label>
                  <Input
                    id="edit-minStock"
                    name="minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-outlet">Outlet</Label>
                <Select value={newProduct.outlet} onValueChange={(value) => handleSelectChange("outlet", value)}>
                  <SelectTrigger id="edit-outlet">
                    <SelectValue placeholder="Pilih outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua Outlet">Semua Outlet</SelectItem>
                    <SelectItem value="Outlet Pusat">Outlet Pusat</SelectItem>
                    <SelectItem value="Outlet Cabang Selatan">Outlet Cabang Selatan</SelectItem>
                    <SelectItem value="Outlet Cabang Timur">Outlet Cabang Timur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Gambar Produk</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border bg-muted flex items-center justify-center">
                    {selectedProduct && (
                      <img
                        src={selectedProduct.image || "/placeholder.svg"}
                        alt={selectedProduct.name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    )}
                  </div>
                  <Button type="button" variant="outline" className="h-10">
                    <Upload className="mr-2 h-4 w-4" /> Ganti Gambar
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="edit-isActive" checked={newProduct.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="edit-isActive">Produk Aktif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditProductOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
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
                    {selectedProduct.category} • Rp {selectedProduct.price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Hapus Produk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

