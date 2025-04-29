"use client"

import { useOutlet } from '@/contexts/outlet-context';
import { getHistoryOrders } from '@/services/order-service';
import { format, parse } from 'date-fns';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DateRangePicker } from '../ui/date-range-picker';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import TransactionDetailDialog from '../transaction-detail-dialog';

type RealtimeStockProps = {
  dateRange: {
    from: Date;
    to: Date;
  },
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date;
    to: Date;
  }>>
}

// Fungsi untuk mengelompokkan transaksi per hari
const groupTransactionsByDay = (transactions: any[]) => {
  const grouped: Record<string, any[]> = {};

  transactions.forEach(transaction => {
    // Parse tanggal dari format "dd/MM/yyyy HH:mm"
    const dateObj = parse(transaction.created_at, 'dd/MM/yyyy HH:mm', new Date());
    const dateKey = format(dateObj, 'dd/MM/yyyy');

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(transaction);
  });

  return grouped;
};

export default function PerDay({ dateRange, setDateRange }: RealtimeStockProps) {
  const { currentOutlet } = useOutlet();

  const handleDateRangeChange = (newRange: { from?: Date; to?: Date }) => {
    setDateRange({
      from: newRange?.from ?? dateRange.from,
      to: newRange?.to ?? dateRange.to
    });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const orderHistory = getHistoryOrders(
    currentOutlet?.id,
    format(dateRange?.from ?? new Date(), 'yyyy-MM-dd'),
    format(dateRange?.to ?? new Date(), 'yyyy-MM-dd')
  );

  const { data: transactionData, isLoading, error } = orderHistory();

  const filteredTransactions = transactionData?.data.orders.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesInvoiceOrCashier = transaction.order_number.toLowerCase().includes(searchLower);
    const matchesProduct = transaction.items.some(item =>
      item.product.toLowerCase().includes(searchLower)
    );
    return matchesInvoiceOrCashier || matchesProduct;
  }) || [];

  // Kelompokkan transaksi per hari
  const transactionsByDay = groupTransactionsByDay(filteredTransactions);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Analisis Penjualan</CardTitle>
          <CardDescription>
            Detail penjualan per hari
            {currentOutlet && ` untuk ${currentOutlet.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="grid grid-cols-2 gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
              <Input
                placeholder='Cari invoice/produk'
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Summary Section */}
          {transactionData?.data.total_orders && (
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Total Penjualan</h3>
                <p className="text-2xl font-bold">
                  Rp {Number(transactionData.data.total_revenue).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Total Order</h3>
                <p className="text-2xl font-bold">
                  {transactionData.data.total_orders}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Total Item</h3>
                <p className="text-2xl font-bold">
                  {transactionData.data.total_items_sold}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium">Rata-rata Order</h3>
                <p className="text-2xl font-bold">
                  Rp {transactionData.data.average_order_value.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Tabel per Hari */}
          {Object.entries(transactionsByDay).map(([date, transactions]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-semibold">{date}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Kasir</TableHead>
                    <TableHead>Metode Pembayaran</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((order) => (
                    <TableRow key={order.order_number}>
                      <TableCell>#{order.order_number}</TableCell>
                      <TableCell>{order.created_at.split(' ')[1]}</TableCell>
                      <TableCell>{order.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.payment_method === 'cash' ? 'Tunai' :
                            order.payment_method === 'transfer' ? "Transfer" : 'Qris'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {Number(order.total).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <TransactionDetailDialog trx={order} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}