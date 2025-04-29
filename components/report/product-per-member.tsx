"use client"

import React, { ChangeEvent, useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { getProductByMember } from "@/services/report-service"
import { useOutlet } from "@/contexts/outlet-context";
import { format } from "date-fns"
import { Input } from "../ui/input"
type ProductPerMemberProps = {
  dateRange: {
    from: Date;
    to: Date;
  },
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date;
    to: Date;
  }>>
}

export default function ProductPerMember({ dateRange, setDateRange }: ProductPerMemberProps) {

  const { currentOutlet } = useOutlet()
  //   constdaterange: {    from: Date;    to: Date;} [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
  //     from: new Date(),
  //     to: new Date(),
  //   })

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filteredMembersData, setFilteredMembersData] = useState([])

  useEffect(() => {
    setFilteredMembersData(data?.data?.members || [])
  }, [data])

  const fetchMemberData = async () => {
    try {
      if (!dateRange.from || !dateRange.to) {
        throw new Error("Silakan pilih rentang tanggal yang valid");
      }

      setIsLoading(true);
      setError(null);

      const response = await getProductByMember({
        outletId: currentOutlet.id,
        dateRange: {
          start_date: format(dateRange.from, 'yyyy-MM-dd'),
          end_date: format(dateRange.to, 'yyyy-MM-dd'),
        },
      });

      if (!response.status) {
        throw new Error(response.message || "Terjadi kesalahan saat mengambil data");
      }

      setData(response);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };


  const handleDateRangeChange = (newValue) => {
    if (!newValue) return;

    const { from, to } = newValue;

    if (from && to && from > to) {
      // Kalau user geser tanggal awal melebihi tanggal akhir, reset to
      setDateRange({ from, to: from });
    } else {
      setDateRange(newValue);
    }
  };

  const handleMembersSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (!data?.data?.members) return;
    const filteredData = data.data.members.filter((prod) =>
      prod.member_name.toLowerCase().includes(searchTerm)
    );

    setFilteredMembersData(filteredData)
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle>Penjualan Per Pelanggan</CardTitle>
        <CardDescription>
          Data penjualan produk dikelompokkan per pelanggan/member
        </CardDescription>
        <div className="flex justify-between items-center mt-4">
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
          />
          <Button onClick={fetchMemberData}>
            Terapkan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            Error: {error.message}
          </div>
        ) : !data?.data?.members ? (
          <div className="text-center py-4">Tidak ada data penjualan</div>
        ) : (
          <>
            <Input placeholder="Cari member" className="w-80 mb-4" onChange={handleMembersSearch} />

            <div className="space-y-6">
              {filteredMembersData.map((member) => (
                <div key={member.member_id ? `member-${member.member_id}` : `member-umum`} className="border rounded-lg">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{member.member_name}</h3>
                      <p className="text-sm text-gray-500">
                        {member.total_orders} transaksi
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Rp {Number(member.total_spent).toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.sales_percentage?.toFixed(2) || '0.00'}% dari total
                      </p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Kategori</TableHead>
                        <TableHead className="text-right">Kuantitas</TableHead>
                        <TableHead className="text-right">Penjualan</TableHead>
                        <TableHead className="text-right">% Pelanggan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {member.products.map((product) => (
                        <TableRow key={product.product_id}>
                          <TableCell className="font-medium">
                            {product.product_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.category}
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(product.quantity)}
                          </TableCell>
                          <TableCell className="text-right">
                            Rp {Number(product.total_spent).toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell className="text-right">
                            {(
                              (product.total_spent / member.total_spent) * 100 || 0
                            ).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>

            {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Pelanggan</p>
                <p className="font-medium">{data.data.summary.total_members}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Transaksi</p>
                <p className="font-medium">{data.data.summary.total_orders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Produk Terjual</p>
                <p className="font-medium">
                  {data.data.members.reduce(
                    (sum, member) => sum + member.products.length, 0
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Penjualan</p>
                <p className="font-medium">
                  Rp {Number(data.data.summary.total_sales).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div> */}
          </>
        )}
      </CardContent>
    </Card>
  )
}