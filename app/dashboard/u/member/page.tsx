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
import { CalendarIcon, Edit, Eye, History, MoreHorizontal, Plus, Trash2, UserPlus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Member, MemberInput } from "@/types/member";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { createMember, deleteMember, getAllMembers, updateMember } from "@/services/member-service";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";

export default function MemberPage() {
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [isDeleteStaffDialogOpen, setIsDeleteStaffDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const initialFormData: MemberInput = {
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  }

  const [formData, setFormData] = useState<MemberInput>(initialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const queryStaff = getAllStaffByOutlet(currentOutlet?.id || 1);
  const { data: members, refetch: refetchMembers } = getAllMembers();
  const { mutate: createMemberMutate, isPending: isCreating } = createMember();
  const delMember = deleteMember();
  const { mutate: updateMemberMutate, isPending: isUpdating } = updateMember(selectedMember?.id || 0);

  const handleCreateStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMemberMutate(formData, {
      onSuccess: () => {
        setIsAddStaffDialogOpen(false);
        refetchMembers();
        setFormData(initialFormData);
        toast({
          title: "Member berhasil ditambahkan",
          description: "Member baru telah berhasil ditambahkan ke sistem.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menambahkan member",
          description: "Terjadi kesalahan saat menambahkan member baru.",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateMember = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedMember) return;

    updateMemberMutate(formData, {
      onSuccess: () => {
        setIsEditStaffDialogOpen(false);
        refetchMembers();
        setFormData(initialFormData);
        setSelectedMember(null);
        toast({
          title: "Perubahan disimpan",
          description: "Data member telah berhasil diperbarui.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menyimpan perubahan",
          description: "Terjadi kesalahan saat memperbarui data member.",
          variant: "destructive",
        });
      },
    });
  }

  const handleDeleteMember = () => {
    if (!selectedMember) return;

    delMember.mutate(selectedMember.id, {
      onSuccess: () => {
        setIsDeleteStaffDialogOpen(false);
        refetchMembers();
        toast({
          title: "Member berhasil dihapus",
          description: "Member telah dihapus dari sistem.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Gagal menghapus member",
          description: "Terjadi kesalahan saat menghapus member.",
          variant: "destructive",
        });
      },
    });
  }

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      ...member,
      // start_time: formatTimeForInput(member.last_shift?.start_time),
      // end_time: formatTimeForInput(member.last_shift?.end_time),
      // password: "",
      // outlet_id: member.outlet_id || currentOutlet?.id || 1,
    });
    setIsEditStaffDialogOpen(true);
  }

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteStaffDialogOpen(true);
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Member</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddStaffDialogOpen || isEditStaffDialogOpen} onOpenChange={(open) => {
            if (!open) {
              setFormData(initialFormData);
              setSelectedMember(null);
            }
            if (isEditStaffDialogOpen) {
              setIsEditStaffDialogOpen(open);
            } else {
              setIsAddStaffDialogOpen(open);
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditStaffDialogOpen ? "Edit Member" : "Tambah Member Baru"}</DialogTitle>
                <DialogDescription>
                  {isEditStaffDialogOpen ? "Edit informasi member" : "Tambahkan member baru dengan mengisi detail di bawah ini."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={isEditStaffDialogOpen ? handleUpdateMember : handleCreateStaff}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nama
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nama member"
                      className="col-span-3"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="member_code" className="text-right">
                      Kode
                    </Label>
                    <Input
                      id="member_code"
                      name="member_code"
                      placeholder="Kode member"
                      className="col-span-3"
                      value={formData.member_code || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Telp
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="No. telp member"
                      className="col-span-3"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      required
                      type="phone"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email member (opsional)"
                      className="col-span-3"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Alamat
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Alamat member (opsional)"
                      className="col-span-3"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="outlet" className="text-right">
                      Jenis Kelamin
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Laki-laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
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
                  Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {selectedMember && (
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{selectedMember.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedMember.email}
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
                  onClick={handleDeleteMember}
                  disabled={delMember.isPending}
                >
                  {delMember.isPending ? "Menghapus..." : "Hapus Member"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        {/* <VisuallyHidden> */}
        <CardHeader>
          <CardTitle>Daftar Member</CardTitle>
          <CardDescription>Kelola member</CardDescription>
        </CardHeader>
        {/* </VisuallyHidden> */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kode Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Total transaksi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {member.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.member_code}</TableCell>
                  <TableCell>{member.email ?? '-'}</TableCell>
                  <TableCell>{member.address ?? '-'}</TableCell>
                  <TableCell>{member.gender === 'male' ? "Laki-laki" : "Perempuan"}</TableCell>
                  <TableCell>{member.orders_count}</TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/u/member/${member.id}`}>
                            <History className="mr-2 h-4 w-4" /> Transaksi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(member)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(member)}
                        >
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
    </div>
  );
}