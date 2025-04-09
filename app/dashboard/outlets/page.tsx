"use client"

import type React from "react"
import { useState, ChangeEvent } from "react"
import { useOutlet } from "@/contexts/outlet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, MapPin, Phone, User, MoreHorizontal } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Outlet, OutletInput } from "@/types/outlet"
import { createOutlet, deleteOutlet, getAllOutlets, updateOutlet } from "@/services/outlet-service"
import { toast } from "@/hooks/use-toast"

export default function OutletsPage() {
  // const { outlets, currentOutlet } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "list"

  const { data: outlets, isLoading: isLoadingOutlets, refetch: refetchOutlets } = getAllOutlets()
  const { mutate: createOutletMutate, isPending: isCreatingOutlet } = createOutlet()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [previewQris, setPreviewQris] = useState<string | null>(null)
  const [selectedOutlet, setSelecetedOutlet] = useState<Outlet | null>(null)
  
  const delOutlet = deleteOutlet()
  const updOutlet = updateOutlet(selectedOutlet?.id || 0)

  const initialFormData: OutletInput = {
    name: '',
    address: '',
    phone: '',
    email: '',
    tax: '',
    qris: null,
    is_active: true,
  }

  const [formData, setFormData] = useState(initialFormData)



  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewQris(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, qris: file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form data:', formData)
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('tax', formData.tax.toString())
    formDataToSend.append('qris', formData.qris)
    createOutletMutate(formDataToSend, {
      onSuccess: () => {
        setIsAddDialogOpen(false)
        setFormData(initialFormData)
        setPreviewQris(null)
        refetchOutlets()
        toast({title: "Berhasil menambahkan outlet"})
      }
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()

    formDataToSend.append('name', formData.name)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('tax', formData.tax.toString())
    // formDataToSend.append('qris', formData.qris)
    formDataToSend.append('is_active', formData.is_active ? '1' : '0');


    if (formData.qris) {
      formDataToSend.append('qris', formData.qris);
    }

    console.log("update", formDataToSend)

    updOutlet.mutate(formDataToSend, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        setFormData(initialFormData)
        setPreviewQris(null)
        refetchOutlets()
        toast({title: "Berhasil update outlet"})
      },
      onError: () => {
        toast({title: "Terjadi kesalahan ketika update outlet", variant: 'destructive'})
      }
    })

  }

  const handleEditClick = (outlet: Outlet) => {
    setSelecetedOutlet(outlet)
    // setIsAddDialogOpen(true)
    setIsEditDialogOpen(true)

    setFormData({
      name: outlet.name,
      address: outlet.address,
      email: outlet.email,
      is_active: outlet.is_active,
      phone: outlet.phone,
      tax: outlet.tax,
      qris: null
    })

    setPreviewQris(outlet.qris_url)
  }

  const handleDeleteClick = (outlet: Outlet) => {
    setIsDeleteDialogOpen(true)
    setSelecetedOutlet(outlet)
  }

  const handleDeleteOutlet = () => {
    if (!selectedOutlet) return

    delOutlet.mutate(selectedOutlet.id, {
      onSuccess: () => {
        refetchOutlets();
        setIsDeleteDialogOpen(false)
      }
    })
  }

  const filteredOutlets = outlets?.data.filter(outlet =>
    outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Outlet</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari outlet..."
              className="w-[200px] pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isAddDialogOpen || isEditDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                // Reset form saat dialog ditutup
                setFormData(initialFormData)
                setPreviewQris(null)
              }
              if (isEditDialogOpen) {
                setIsEditDialogOpen(open)
              } else {
                setIsAddDialogOpen(open)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setSelecetedOutlet(false)}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Outlet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {isAddDialogOpen ? 'Tambah Outlet Baru' : 'Edit Outlet'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {isAddDialogOpen ? 'Lengkapi informasi outlet baru' : 'Perbarui informasi outlet'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={isAddDialogOpen ? handleSubmit : handleEditSubmit} encType="multipart/form-data">
                <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Informasi Dasar */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Informasi Dasar</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nama Outlet</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama outlet"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nomor Telepon</Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Masukkan nomor telepon"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Alamat Lengkap</Label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Masukkan alamat lengkap"
                        required
                      />
                    </div>
                  </div>

                  {/* Informasi Tambahan */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">Informasi Tambahan</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Masukkan alamat email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Persentase Pajak (%)</Label>
                        <Input
                          name="tax"
                          type="number"
                          value={formData.tax}
                          onChange={handleInputChange}
                          placeholder="Masukkan persentase pajak"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* QRIS Upload */}
                  <div className="space-y-4 p-4 rounded-lg border bg-muted/40">
                    <h3 className="font-medium text-base">QRIS</h3>
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative h-32 w-32 rounded-lg border-2 border-dashed bg-background">
                          {previewQris ? (
                            <img
                              src={previewQris}
                              alt="Preview QRIS"
                              className="h-full w-full rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <MapPin className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground text-center">
                          Format: JPEG/PNG
                          <br />
                          Maks. 10MB
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <Label>Upload QRIS</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            name="qris"
                            onChange={handleFileChange}
                            className="file:text-foreground file:bg-transparent file:border-0"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                          />
                          <Label className="flex flex-col gap-1">
                            <span>Status Aktif</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              Outlet akan muncul di aplikasi jika diaktifkan
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
                      setIsAddDialogOpen(false)
                      setIsEditDialogOpen(false)
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4" />
                    {selectedOutlet ? 'Simpan Perubahan' : 'Tambah Outlet'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {tab === "list" && (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Outlet</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Pajak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets?.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{outlet.name}</div>
                          <div className="text-xs text-muted-foreground">{outlet.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">{outlet.address}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{outlet.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>{outlet.tax}%</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          outlet.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {outlet.is_active ? "Aktif" : "Tidak Aktif"}
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
                          <DropdownMenuItem onClick={() => handleEditClick(outlet)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(outlet)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* {tab === "performance" && (
        <Card>
          <CardHeader>
            <CardTitle>Performa Outlet</CardTitle>
            <CardDescription>Bandingkan performa antar outlet</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet</TableHead>
                  <TableHead className="text-right">Penjualan Bulan Ini</TableHead>
                  <TableHead className="text-right">Transaksi</TableHead>
                  <TableHead className="text-right">Rata-rata Transaksi</TableHead>
                  <TableHead className="text-right">YoY Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outlets?.data.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell className="font-medium">{outlet.name}</TableCell>
                    <TableCell className="text-right">
                      Rp {(Math.random() * 100000000 + 50000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </TableCell>
                    <TableCell className="text-right">{Math.floor(Math.random() * 1000 + 500)}</TableCell>
                    <TableCell className="text-right">
                      Rp {(Math.random() * 100000 + 50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={Math.random() > 0.3 ? "text-green-600" : "text-red-600"}>
                        {Math.random() > 0.3 ? "+" : ""}
                        {(Math.random() * 30 - (Math.random() > 0.3 ? 0 : 10)).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )} */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus Outlet ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedOutlet && (
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{selectedOutlet.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedOutlet.address}
                  </div>
                </div>
              </div>
            )}
            {/* {selectedCategory && selectedCategory.products_count > 0 && (
              <div className="mt-4 rounded-md bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                <p className="text-sm">
                  Kategori ini memiliki {selectedCategory.products_count} produk terkait. Hapus atau pindahkan
                  produk-produk tersebut sebelum menghapus kategori.
                </p>
              </div>
            )} */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteOutlet}
            // disabled={selectedCategory ? selectedCategory.products_count > 0 : false}
            >
              Hapus Outlet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}