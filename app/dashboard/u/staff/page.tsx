"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, MoreHorizontal, Plus, Trash2, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getAllOutlets } from "@/services/outlet-service";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { StaffDetail, StaffInput } from "@/types/staff";
import { createStaff, deleteStaff, getAllStaffByOutlet, updateStaff } from "@/services/staff-service";
import { useOutlet } from "@/contexts/outlet-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function ShiftsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "shifts";
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [isDeleteStaffDialogOpen, setIsDeleteStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffDetail | null>(null)
  const { currentOutlet } = useOutlet();

  const initialFormData: StaffInput = {
    email: "",
    name: "",
    password: "",
    role: "",
    start_time: "",
    end_time: "",
    outlet_id: currentOutlet?.id || 1,
  }

  const [formData, setFormData] = useState<StaffInput>(initialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { data: outlets } = getAllOutlets();
  const queryStaff = getAllStaffByOutlet(currentOutlet?.id || 1);
  const { data: staffs, refetch: refetchStaffs } = queryStaff();
  const { mutate: createStaffMutate, isPending: isCreating } = createStaff();
  const delStaff = deleteStaff();
  const { mutate: updateStaffMutate, isPending: isUpdating } = updateStaff(selectedStaff?.id || 0);
  const { user } = useAuth()
  const handleCreateStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createStaffMutate(formData, {
      onSuccess: () => {
        setIsAddStaffDialogOpen(false);
        refetchStaffs();
        setFormData(initialFormData);
        toast({
          title: "Staff berhasil ditambahkan",
          description: "Staff baru telah berhasil ditambahkan ke sistem.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menambahkan staff",
          description: "Terjadi kesalahan saat menambahkan staff baru.",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateStaff = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedStaff) return;

    updateStaffMutate(formData, {
      onSuccess: () => {
        setIsEditStaffDialogOpen(false);
        refetchStaffs();
        setFormData(initialFormData);
        setSelectedStaff(null);
        toast({
          title: "Perubahan disimpan",
          description: "Data staff telah berhasil diperbarui.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menyimpan perubahan",
          description: "Terjadi kesalahan saat memperbarui data staff.",
          variant: "destructive",
        });
      },
    });
  }

  const handleDeleteStaff = () => {
    if (!selectedStaff) return;

    delStaff.mutate(selectedStaff.id, {
      onSuccess: () => {
        setIsDeleteStaffDialogOpen(false);
        refetchStaffs();
        toast({
          title: "Staff berhasil dihapus",
          description: "Staff telah dihapus dari sistem.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menghapus staff",
          description: "Terjadi kesalahan saat menghapus staff.",
          variant: "destructive",
        });
      },
    });
  }

  const formatTimeForInput = (time: string | null | undefined): string => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  };

  const handleEditClick = (staff: StaffDetail) => {
    setSelectedStaff(staff);
    setFormData({
      ...staff,
      start_time: formatTimeForInput(staff.last_shift?.start_time),
      end_time: formatTimeForInput(staff.last_shift?.end_time),
      password: "", // Don't pre-fill password for security
      outlet_id: staff.outlet_id || currentOutlet?.id || 1,
    });
    setIsEditStaffDialogOpen(true);
  }

  const handleDeleteClick = (staff: StaffDetail) => {
    setSelectedStaff(staff);
    setIsDeleteStaffDialogOpen(true);
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Staff</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddStaffDialogOpen || isEditStaffDialogOpen} onOpenChange={(open) => {
            if (!open) {
              setFormData(initialFormData);
              setSelectedStaff(null);
            }
            if (isEditStaffDialogOpen) {
              setIsEditStaffDialogOpen(open);
            } else {
              setIsAddStaffDialogOpen(open);
            }
          }}>
            <DialogTrigger asChild>
              {user?.role === "admin" && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Staff
                </Button>
              )}

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditStaffDialogOpen ? "Edit Staff" : "Tambah Staff Baru"}</DialogTitle>
                <DialogDescription>
                  {isEditStaffDialogOpen ? "Edit informasi staff" : "Tambahkan staff baru dengan mengisi detail di bawah ini."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={isEditStaffDialogOpen ? handleUpdateStaff : handleCreateStaff}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nama
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nama staff"
                      className="col-span-3"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email staff"
                      className="col-span-3"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      required
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="col-span-3"
                      value={formData.password || ""}
                      onChange={handleInputChange}
                      required={!isEditStaffDialogOpen}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Peran
                    </Label>
                    <Select
                      value={formData.role || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="kasir">Kasir</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start_time" className="text-right">
                      Waktu Mulai
                    </Label>
                    <Input
                      id="start_time"
                      name="start_time"
                      type="time"
                      className="col-span-3"
                      value={formData.start_time || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end_time" className="text-right">
                      Waktu Selesai
                    </Label>
                    <Input
                      id="end_time"
                      name="end_time"
                      type="time"
                      className="col-span-3"
                      value={formData.end_time || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="outlet" className="text-right">
                      Outlet
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.outlet_id?.toString() || ""}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, outlet_id: parseInt(value) }))}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih outlet" />
                        </SelectTrigger>
                        <SelectContent>
                          {outlets?.data.map((outlet) => (
                            <SelectItem key={outlet.id} value={outlet.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{outlet.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddStaffDialogOpen(false);
                      setIsEditStaffDialogOpen(false);
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <span className="animate-pulse">Menyimpan...</span>
                    ) : isEditStaffDialogOpen ? (
                      "Simpan Perubahan"
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDeleteStaffDialogOpen} onOpenChange={setIsDeleteStaffDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus staff ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {selectedStaff && (
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{selectedStaff.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedStaff.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteStaffDialogOpen(false)}>
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteStaff}
                  disabled={delStaff.isPending}
                >
                  {delStaff.isPending ? "Menghapus..." : "Hapus Staff"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Staff</CardTitle>
          <CardDescription>Kelola staff dan penugasan shift</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Shift</TableHead>
                {user?.role === "admin" && (
                  <TableHead className="text-right">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs?.data.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {staff.last_shift?.start_time ? (
                      <span className="text-sm">
                        {staff.last_shift.start_time} - {staff.last_shift.end_time}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Belum ada shift</span>
                    )}
                  </TableCell>
                  {user?.role === "admin" && (
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
                          <DropdownMenuItem onClick={() => handleEditClick(staff)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(staff)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}