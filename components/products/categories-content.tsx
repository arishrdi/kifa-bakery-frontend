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
import { createCategory, getAllCategories, useDeleteCategory, useUpdateCategory } from "@/services/category-service"
import { useInvalidateQueries } from "@/hooks/use-invalidate-queries"
import { Category } from "@/types/category"
import { toast } from "@/hooks/use-toast"

export default function CategoriesContent() {
  const { currentOutlet } = useOutlet()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  const { invalidate } = useInvalidateQueries();

  const { data: categories, isLoading, refetch: refetchCategories } = getAllCategories()
  const postCategory = createCategory()
  const mutation = useUpdateCategory(selectedCategory?.id ?? 0)
  const deleteCategory = useDeleteCategory()

  // Filter categories based on search query
  const filteredCategories = categories?.data.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()

    postCategory.mutate({
      name: newCategory.name,
      description: newCategory.description,
    }, {
      onSuccess: () => {
        invalidate(['categories'])
        setIsAddCategoryOpen(false)
        resetForm()
        refetchCategories()
        toast({
          title: "Kategori Berhasil Ditambahkan!",
          description: "Kategori baru telah berhasil disimpan ke sistem.",
          variant: "default"
        })
      },
      onError: () => {
        toast({
          title: "Gagal Menambahkan Kategori!",
          description: "Terjadi kesalahan saat mencoba menambahkan kategori. Silakan coba lagi.",
          variant: "destructive"
        })
      }
    })
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setNewCategory({
      name: category.name,
      description: category.description,
    });
    setIsEditCategoryOpen(true)
  }

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    mutation.mutate({
      name: newCategory.name,
      description: newCategory.description,
    }, {
      onSuccess: () => {
        invalidate(['categories'])
        refetchCategories()
        setIsEditCategoryOpen(false)
        resetForm()
        toast({
          title: "Perubahan Disimpan!",
          description: "Kategori telah berhasil diperbarui.",
          variant: "default"
        })
      },
      onError: () => {
        toast({
          title: "Gagal Memperbarui Kategori!",
          description: "Terjadi kesalahan saat mencoba memperbarui kategori. Silakan coba lagi.",
          variant: "destructive"
        })
      }
    })
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCategory = () => {
    if (!selectedCategory) return

    deleteCategory.mutate(selectedCategory.id, {
      onSuccess: () => {
        refetchCategories();
        setIsDeleteDialogOpen(false);
        toast({
          title: "Kategori Berhasil Dihapus!",
          description: "Kategori telah berhasil dihapus dari sistem.",
          variant: "default"
        })
      },
      onError: () => {
        toast({
          title: "Gagal Menghapus Kategori!",
          description: "Terjadi kesalahan saat mencoba menghapus kategori. Silakan coba lagi.",
          variant: "destructive"
        })
      }
    });
  }

  const resetForm = () => {
    setNewCategory({
      name: "",
      description: "",
    })
    setSelectedCategory(null)
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
          <Dialog 
            open={isAddCategoryOpen} 
            onOpenChange={(open) => {
              if (!open) resetForm();
              setIsAddCategoryOpen(open);
            }}
          >
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
                    <Input 
                      id="name" 
                      name="name" 
                      value={newCategory.name} 
                      onChange={handleInputChange} 
                      required 
                    />
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
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddCategoryOpen(false)
                      resetForm()
                    }}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                  >
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
          <AlertDescription>
            Kategori yang ditampilkan adalah untuk outlet {currentOutlet.name}.
          </AlertDescription>
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
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories && filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="font-medium">{category.name}</div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{category.description}</TableCell>
                  <TableCell className="text-center">{category.products_count}</TableCell>
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
                          disabled={category.products_count > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories && filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Tidak ada kategori yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog 
        open={isEditCategoryOpen} 
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsEditCategoryOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Ubah detail kategori di bawah ini. Klik simpan setelah selesai.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Kategori</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={newCategory.name} 
                  onChange={handleInputChange} 
                  required 
                />
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
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditCategoryOpen(false)
                  resetForm()
                }}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600"
              >
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
            <DialogTitle>Konfirmasi Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedCategory && (
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{selectedCategory.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCategory.description}
                  </div>
                </div>
              </div>
            )}
            {selectedCategory && selectedCategory.products_count > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Peringatan</AlertTitle>
                <AlertDescription>
                  Kategori ini memiliki {selectedCategory.products_count} produk terkait. Hapus atau pindahkan
                  produk-produk tersebut sebelum menghapus kategori.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={selectedCategory ? selectedCategory.products_count > 0 : false}
            >
              Hapus Kategori
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}