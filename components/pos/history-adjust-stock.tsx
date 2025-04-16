"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Inventory, InventoryWithRelations } from '@/types/inventory'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { format } from "date-fns"
import { id } from "date-fns/locale"

type HistoryAdjustStockProps = {
    inventories: InventoryWithRelations[]
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>
}

export default function HistoryAdjustStock({ inventories, date, setDate }: HistoryAdjustStockProps) {

    // const [date, setDate] = useState<Date>(new Date())

    return (
        <div className=''>
            <Popover>
                <PopoverTrigger asChild>
                    <div className='pt-3 pb-4'>

                        <Button
                            variant="outline"
                            className={cn(
                                "justify-start text-left font-normal border-orange-200",
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
            <div className='border rounded-md max-h-[300px] overflow-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-sm font-semibold text-gray-700">Nama Produk</TableHead>
                            <TableHead className="text-sm font-semibold text-gray-700">Perubahan</TableHead>
                            <TableHead className="text-sm font-semibold text-gray-700">Tipe</TableHead>
                            <TableHead className="text-sm font-semibold text-gray-700">Keterangan</TableHead>
                            <TableHead className="text-sm font-semibold text-gray-700">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventories.map((inventory) => (
                            <TableRow key={inventory.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="text-sm text-gray-800 font-medium">{inventory.product.name}</TableCell>
                                <TableCell className="text-sm text-gray-600">{inventory.quantity_change}</TableCell>
                                <TableCell className="text-sm text-gray-600">{inventory.type === 'adjustment' ? "Penyesuaian" : inventory.type === 'shipment' ? 'Kiriman Pabrik' : inventory.type === 'purchase' ? 'Pembelian' : "Lainnya"}</TableCell>
                                <TableCell className="text-sm text-gray-600">{inventory.notes}</TableCell>
                                <TableCell className="text-sm text-gray-600">{inventory.status === 'approved' ? <Badge>Disetujui</Badge> : inventory.status === 'rejected' ? <Badge variant="destructive">Ditolak</Badge> : <Badge variant="secondary">Pending</Badge>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
