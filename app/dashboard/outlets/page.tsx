"use client"

import type React from "react"

import { useState } from "react"
import { useOutlet, type Outlet } from "@/contexts/outlet-context"
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
import { Plus, Search, Edit, MapPin, Phone, User } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function OutletsPage() {
  const { outlets } = useOutlet()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "list"

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOutletOpen, setIsAddOutletOpen] = useState(false)
  const [newOutlet, setNewOutlet] = useState<Partial<Outlet>>({
    name: "",
    address: "",
    phone: "",
    manager: "",
    isActive: true,
  })

  // Filter outlets based on search query
  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.manager.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewOutlet((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to save the new outlet
    console.log("New outlet:", newOutlet)
    setIsAddOutletOpen(false)
    setNewOutlet({
      name: "",
      address: "",
      phone: "",
      manager: "",
      isActive: true,
    })
  }

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
          <Dialog open={isAddOutletOpen} onOpenChange={setIsAddOutletOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Outlet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Outlet Baru</DialogTitle>
                <DialogDescription>Isi detail outlet baru di bawah ini. Klik simpan setelah selesai.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nama Outlet
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newOutlet.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Alamat
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={newOutlet.address}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Telepon
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newOutlet.phone}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="manager" className="text-right">
                      Manager
                    </Label>
                    <Input
                      id="manager"
                      name="manager"
                      value={newOutlet.manager}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {tab === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Outlet</CardTitle>
            <CardDescription>Kelola semua outlet dalam satu tampilan</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Outlet</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell className="font-medium">{outlet.name}</TableCell>
                    <TableCell>{outlet.address}</TableCell>
                    <TableCell>{outlet.phone}</TableCell>
                    <TableCell>{outlet.email}</TableCell>
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
                      <Button variant="ghost" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "map" && (
        <Card>
          <CardHeader>
            <CardTitle>Peta Outlet</CardTitle>
            <CardDescription>Visualisasi lokasi outlet pada peta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">Peta outlet akan ditampilkan di sini</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {outlets.map((outlet) => (
                <Card key={outlet.id} className="overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{outlet.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {outlet.address}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {outlet.phone}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        {outlet.email}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "performance" && (
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
                {outlets.map((outlet) => (
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
      )}
    </div>
  )
}

