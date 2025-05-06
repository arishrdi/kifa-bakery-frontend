import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import { CalendarIcon, Check, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { useOutlet } from '@/contexts/outlet-context'
import { adminApproveInventory, adminRejectInventory, getInventoryHistoriesCashier } from '@/services/inventory-service'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { id } from 'date-fns/locale'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

export default function ApproveStock({search}: {search: string}) {

    const { currentOutlet } = useOutlet()
    const [date, setDate] = useState<Date>(new Date())
    const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null)
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')

    const { data: inventories, refetch: refetchInventory } = getInventoryHistoriesCashier(currentOutlet?.id ?? 0, format(date, 'yyyy-MM-dd'))
    const approveStock = adminApproveInventory()
    const rejectStock = adminRejectInventory()

    const handleApprove = (inventoryId: number) => {
        approveStock.mutate({ inventory_history_id: inventoryId }, {
            onSuccess: () => {
                refetchInventory(),
                    toast({
                        title: "Stok Disetujui",
                        description: "Permintaan perubahan stok telah berhasil disetujui."
                    })
            }
        })
    }

    const handleReject = (inventoryId: number) => {
        rejectStock.mutate({ inventory_history_id: inventoryId }, {
            onSuccess: () => {
                refetchInventory(),
                    toast({
                        title: "Stock ditolak", variant: "destructive",
                        description: "Penolakan berhasil, stok tidak mengalami perubahan."
                    })
            }
        })
    }

    const handleConfirm = () => {
        if (!selectedInventoryId) return
        if (actionType === 'approve') {
            handleApprove(selectedInventoryId)
        } else {
            handleReject(selectedInventoryId)
        }
        setSelectedInventoryId(null)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <span>Penyesuaian Stok Menunggu Persetujuan</span>
                    <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Persetujuan penyesuaian stok dari kasir yang membutuhkan tindakan Anda
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">


                <Popover>
                    <PopoverTrigger asChild>
                        <div className='pt-3 pb-4'>

                            <Button
                                variant="outline"
                                className={cn(
                                    "justify-start text-left font-normal ",
                                    !date && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                            </Button>
                        </div>
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

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Stok Sebelum</TableHead>
                                <TableHead>Perubahan</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Diajukan Oleh</TableHead>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Catatan</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventories?.data.filter((adjustment) => adjustment.product?.name.toLowerCase().includes(search) || adjustment?.notes?.toLowerCase().includes(search))
                            .map((adjustment) => (
                                <TableRow key={adjustment.id}>
                                    <TableCell className="font-medium">
                                        {adjustment.product?.name || 'Produk tidak ditemukan'}
                                    </TableCell>
                                    <TableCell>{adjustment.quantity_before}</TableCell>
                                    <TableCell>
                                        <span className={adjustment.quantity_change > 0 ? "text-green-600" : "text-red-600"}>
                                            {adjustment.quantity_change > 0 ? `+${adjustment.quantity_change}` : adjustment.quantity_change}
                                        </span>
                                    </TableCell>
                                    <TableCell>{adjustment.type === 'adjustment' ? "Penyesuaian" : adjustment.type === 'shipment' ? 'Kiriman Pabrik' : adjustment.type === 'purchase' ? 'Pembelian' : "Lainnya"}</TableCell>

                                    <TableCell>{adjustment.user?.name || 'Unknown'}</TableCell>
                                    <TableCell>{format(new Date(adjustment.created_at), "dd MMM yyyy HH:mm", { locale: id })}</TableCell>
                                    <TableCell>{adjustment.notes || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        {adjustment.status === 'pending' && (
                                            <div className='space-x-2 flex justify-end'>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="text-green-600 border-green-600 hover:bg-green-50 gap-1"
                                                            onClick={() => {
                                                                setSelectedInventoryId(adjustment.id)
                                                                setActionType('approve')
                                                            }}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Konfirmasi Persetujuan</DialogTitle>
                                                            <DialogDescription>
                                                                Apakah Anda yakin ingin menyetujui penyesuaian stok ini?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>

                                                            <DialogClose asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => setSelectedInventoryId(null)}
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                onClick={handleConfirm}
                                                                disabled={approveStock.isPending}
                                                            >
                                                                {approveStock.isPending ? 'Memproses...' : 'Ya, Setujui'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="text-red-600 border-red-600 hover:bg-red-50 gap-1"
                                                            onClick={() => {
                                                                setSelectedInventoryId(adjustment.id)
                                                                setActionType('reject')
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Konfirmasi Penolakan</DialogTitle>
                                                            <DialogDescription>
                                                                Apakah Anda yakin ingin menolak penyesuaian stok ini?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose asChild>

                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => setSelectedInventoryId(null)}
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={handleConfirm}
                                                                disabled={rejectStock.isPending}
                                                            >
                                                                {rejectStock.isPending ? 'Memproses...' : 'Ya, Tolak'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}

                                        {adjustment.status === 'approved' && <Badge>Disetujui</Badge>}
                                        {adjustment.status === 'rejected' && <Badge variant="destructive">Ditolak</Badge>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
