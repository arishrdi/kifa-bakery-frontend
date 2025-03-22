"use client"

import type React from "react"

import { useState } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Store, MoreHorizontal, Cake, Coffee, Pizza, Tag } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample categories data
const initialCategories = [
  {
    id: 1,
    name: "Roti",
    description: "Berbagai jenis roti dan pastry",
    productCount: 15,
    isActive: true,
    icon: "Cake",
    color: "#FDA4AF",
  },
  {
    id: 2,
    name: "Donat",
    description: "Donat dengan berbagai topping",
    productCount: 8,
    isActive: true,
    icon: "Coffee",
    color: "#FCD34D",
  },
  {
    id: 3,
    name: "Kue",
    description: "Kue tradisional dan modern",
    productCount: 25,
    isActive: true,
    icon: "Cake",
    color: "#86EFAC",
  },
  {
    id: 4,
    name: "Pastry",
    description: "Pastry dan kue kering",
    productCount: 12,
    isActive: true,
    icon: "Pizza",
    color: "#93C5FD",
  },
]

export default function CategoriesContent() {
  const { currentOutlet } = useOutlet()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState(initialCategories)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "Cake",
    color: "#FDA4AF",
    isActive: true,
  })

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setNewCategory((prev) => ({ ...prev, isActive: checked }))
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    const categoryToAdd = {
      id: categories.length + 1,
      name: newCategory.name,
      description: newCategory.description,
      productCount: 0,
      isActive: newCategory.isActive,
      icon: newCategory.icon,
      color: newCategory.color,
    }

    setCategories([...categories, categoryToAdd])
    setIsAddCategoryOpen(false)
    resetForm()
  }

  const handleEditClick = (category: any) => {
    setSelectedCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
    })
    setIsEditCategoryOpen(true)
  }

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    const updatedCategories = categories.map((category) => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          name: newCategory.name,
          description: newCategory.description,
          icon: newCategory.icon,
          color: newCategory.color,
          isActive: newCategory.isActive,
        }
      }
      return category
    })

    setCategories(updatedCategories)
    setIsEditCategoryOpen(false)
    resetForm()
  }

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCategory = () => {
    if (!selectedCategory) return

    const updatedCategories = categories.filter((category) => category.id !== selectedCategory.id)
    setCategories(updatedCategories)
    setIsDeleteDialogOpen(false)
    setSelectedCategory(null)
  }

  const resetForm = () => {
    setNewCategory({
      name: "",
      description: "",
      icon: "Cake",
      color: "#FDA4AF",
      isActive: true,
    })
    setSelectedCategory(null)
  }

  // Function to get the appropriate icon component based on the icon name
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Cake":
        return <Cake className="h-4 w-4" />
      case "Coffee":
        return <Coffee className="h-4 w-4" />
      case "Pizza":
        return <Pizza className="h-4 w-4" />
      default:
        return <Tag className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Kategori</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari kategori..."
              className="w-[200px] pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Kategori Baru</DialogTitle>
                <DialogDescription>
                  Isi detail kategori baru di bawah ini. Klik simpan setelah selesai.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Kategori</Label>
                    <Input id="name" name="name" value={newCategory.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newCategory.description}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Ikon</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={newCategory.icon === "Cake" ? "default" : "outline"}
                        className={`h-10 ${newCategory.icon === "Cake" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                        onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Cake" }))}
                      >
                        <Cake className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant={newCategory.icon === "Coffee" ? "default" : "outline"}
                        className={`h-10 ${newCategory.icon === "Coffee" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                        onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Coffee" }))}
                      >
                        <Coffee className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant={newCategory.icon === "Pizza" ? "default" : "outline"}
                        className={`h-10 ${newCategory.icon === "Pizza" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                        onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Pizza" }))}
                      >
                        <Pizza className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        variant={newCategory.icon === "Tag" ? "default" : "outline"}
                        className={`h-10 ${newCategory.icon === "Tag" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                        onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Tag" }))}
                      >
                        <Tag className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Warna</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        id="color"
                        name="color"
                        value={newCategory.color}
                        onChange={handleInputChange}
                        className="h-10 w-20 p-1"
                      />
                      <div
                        className="w-10 h-10 rounded-md border flex items-center justify-center"
                        style={{ backgroundColor: newCategory.color }}
                      >
                        {getCategoryIcon(newCategory.icon)}
                      </div>
                      <span className="text-sm">Pratinjau</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" checked={newCategory.isActive} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="isActive">Kategori Aktif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
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
          <AlertTitle>Mengelola kategori untuk: {currentOutlet.name}</AlertTitle>
          <AlertDescription>Kategori yang ditampilkan adalah untuk outlet {currentOutlet.name}.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>Kelola kategori produk yang tersedia di toko Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-center">Jumlah Produk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: category.color }}
                      >
                        {getCategoryIcon(category.icon)}
                      </div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{category.description}</TableCell>
                  <TableCell className="text-center">{category.productCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        category.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {category.isActive ? "Aktif" : "Tidak Aktif"}
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
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(category)}
                          disabled={category.productCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada kategori yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>Ubah detail kategori di bawah ini. Klik simpan setelah selesai.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Kategori</Label>
                <Input id="edit-name" name="name" value={newCategory.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-icon">Ikon</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={newCategory.icon === "Cake" ? "default" : "outline"}
                    className={`h-10 ${newCategory.icon === "Cake" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Cake" }))}
                  >
                    <Cake className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant={newCategory.icon === "Coffee" ? "default" : "outline"}
                    className={`h-10 ${newCategory.icon === "Coffee" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Coffee" }))}
                  >
                    <Coffee className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant={newCategory.icon === "Pizza" ? "default" : "outline"}
                    className={`h-10 ${newCategory.icon === "Pizza" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Pizza" }))}
                  >
                    <Pizza className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant={newCategory.icon === "Tag" ? "default" : "outline"}
                    className={`h-10 ${newCategory.icon === "Tag" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setNewCategory((prev) => ({ ...prev, icon: "Tag" }))}
                  >
                    <Tag className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-color">Warna</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    id="edit-color"
                    name="color"
                    value={newCategory.color}
                    onChange={handleInputChange}
                    className="h-10 w-20 p-1"
                  />
                  <div
                    className="w-10 h-10 rounded-md border flex items-center justify-center"
                    style={{ backgroundColor: newCategory.color }}
                  >
                    {getCategoryIcon(newCategory.icon)}
                  </div>
                  <span className="text-sm">Pratinjau</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="edit-isActive" checked={newCategory.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="edit-isActive">Kategori Aktif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedCategory && (
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  {getCategoryIcon(selectedCategory.icon)}
                </div>
                <div>
                  <div className="font-medium">{selectedCategory.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                    {selectedCategory.description}
                  </div>
                </div>
              </div>
            )}
            {selectedCategory && selectedCategory.productCount > 0 && (
              <div className="mt-4 rounded-md bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                <p className="text-sm">
                  Kategori ini memiliki {selectedCategory.productCount} produk terkait. Hapus atau pindahkan
                  produk-produk tersebut sebelum menghapus kategori.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={selectedCategory && selectedCategory.productCount > 0}
            >
              Hapus Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

