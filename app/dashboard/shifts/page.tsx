"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, Plus, UserPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const shiftsData = [
  {
    id: 1,
    name: "Pagi",
    time: "06:00 - 14:00",
    staff: ["Ahmad", "Budi"],
    status: "completed",
    date: "2023-03-20",
    transactions: 45,
    sales: 2250000,
  },
  {
    id: 2,
    name: "Siang",
    time: "14:00 - 22:00",
    staff: ["Cindy", "Dodi"],
    status: "active",
    date: "2023-03-20",
    transactions: 32,
    sales: 1600000,
  },
  {
    id: 3,
    name: "Malam",
    time: "22:00 - 06:00",
    staff: ["Eko", "Fani"],
    status: "upcoming",
    date: "2023-03-20",
    transactions: 0,
    sales: 0,
  },
  {
    id: 4,
    name: "Pagi",
    time: "06:00 - 14:00",
    staff: ["Gina", "Hadi"],
    status: "upcoming",
    date: "2023-03-21",
    transactions: 0,
    sales: 0,
  },
];

const staffData = [
  { id: 1, name: "Ahmad", role: "Kasir", shifts: ["Pagi"] },
  { id: 2, name: "Budi", role: "Kasir", shifts: ["Pagi"] },
  { id: 3, name: "Cindy", role: "Kasir", shifts: ["Siang"] },
  { id: 4, name: "Dodi", role: "Supervisor", shifts: ["Siang"] },
  { id: 5, name: "Eko", role: "Kasir", shifts: ["Malam"] },
  { id: 6, name: "Fani", role: "Supervisor", shifts: ["Malam"] },
  { id: 7, name: "Gina", role: "Kasir", shifts: ["Pagi"] },
  { id: 8, name: "Hadi", role: "Supervisor", shifts: ["Pagi"] },
];

export default function ShiftsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "shifts";

  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Shift</h2>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Shift Baru</DialogTitle>
                <DialogDescription>
                  Buat shift baru dengan mengisi detail di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nama shift"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-time" className="text-right">
                    Waktu Mulai
                  </Label>
                  <Input id="start-time" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end-time" className="text-right">
                    Waktu Selesai
                  </Label>
                  <Input id="end-time" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staff" className="text-right">
                    Staff
                  </Label>
                  <div className="col-span-3">
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Pilih Staff
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {tab === "shifts" && (
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Jadwal Shift</CardTitle>
              <CardDescription>Kelola jadwal shift harian</CardDescription>
            </div>
            <div className="ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Transaksi</TableHead>
                  <TableHead className="text-right">Penjualan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftsData.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {shift.time}
                      </div>
                    </TableCell>
                    <TableCell>{shift.staff.join(", ")}</TableCell>
                    <TableCell>
                      {shift.status === "active" && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Aktif
                        </Badge>
                      )}
                      {shift.status === "completed" && (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          Selesai
                        </Badge>
                      )}
                      {shift.status === "upcoming" && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        >
                          Akan Datang
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {shift.transactions}
                    </TableCell>
                    <TableCell className="text-right">
                      {shift.sales > 0
                        ? `Rp ${shift.sales.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === "staff" && (
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
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffData.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.shifts.join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}
