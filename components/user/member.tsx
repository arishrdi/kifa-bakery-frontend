"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DateRangePicker } from '../ui/date-range-picker';
import { getHistoryOrders } from '@/services/order-service';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, Search } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import TransactionDetailDialog from '../transaction-detail-dialog';

export default function MemberDetail({ id }: { id: string }) {

    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(1)), // Tanggal 1 bulan ini
        to: new Date() // Hari ini
    });

    const [searchQuery, setSearchQuery] = useState("")


    const handleDateRangeChange = (newRange: { from?: Date; to?: Date }) => {
        setDateRange({
          from: newRange?.from ?? dateRange.from, // Pertahankan nilai sebelumnya jika undefined
          to: newRange?.to ?? dateRange.to
        });
      };

    const orderHistory = getHistoryOrders(undefined, format(dateRange.from, 'yyyy-MM-dd'), format(dateRange.to, 'yyyy-MM-dd'), id)
    const { data: transactionData, refetch: refetchOrder } = orderHistory()
    const filteredTransactions = transactionData?.data.orders.filter((transaction) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            transaction.order_number.toLowerCase().includes(searchLower) ||
            transaction.user.toLowerCase().includes(searchLower)
        );
    }) || [];


    return (
        <div className='flex flex-col space-y-4'>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Riwayat Transaksi Member</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Cari berdasarkan invoice"
                            className="w-[200px] pl-8 md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <VisuallyHidden>
                        <CardTitle>Daftar Riwayat transaksi</CardTitle>
                        <CardDescription>Riwayat transaksi pada member</CardDescription>
                    </VisuallyHidden>
                    <DateRangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                    />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Outlet</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Metode bayar</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((trx) => (
                                <TableRow key={trx.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="text-sm text-gray-600">{trx.created_at}</TableCell>
                                    <TableCell className="text-sm text-gray-800 font-medium">{trx.order_number}</TableCell>
                                    <TableCell className="text-sm text-gray-600">{trx.outlet}</TableCell>
                                    <TableCell className="text-sm text-gray-600">{trx.items.length}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs px-2 py-1 rounded-full ${trx.payment_method === "cash"
                                                ? "bg-green-100 text-green-800 border-green-200"
                                                : "bg-blue-100 text-blue-800 border-blue-200"
                                                }`}
                                        >
                                            {trx.payment_method === "cash" ? "Tunai" : "QRIS"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {trx.status === 'completed' ? (
                                            <span className="text-green-600 font-medium">Selesai</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Dibatalkan</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-sm font-semibold text-gray-800">
                                        Rp {Number(trx.total).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TransactionDetailDialog trx={trx} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div >
    )
}
