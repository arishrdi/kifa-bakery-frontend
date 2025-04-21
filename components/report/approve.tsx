import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Printer } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useOutlet } from '@/contexts/outlet-context'
import { cn } from '@/lib/utils'
import { id } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { getApprovalReports, useApprovalReports } from '@/services/report-service'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ApprovalReportProps = {
  date: DateRange | undefined,
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}
export default function ApprovalReport({ date, setDate }: ApprovalReportProps) {
  const { currentOutlet } = useOutlet()
  // const [date, setDate] = useState<DateRange | undefined>({
  //     from: new Date(new Date().setDate(1)), // First day of current month
  //     to: new Date()
  // })

  // Tambahkan kondisi untuk memastikan query dijalankan dengan parameter yang valid
  const { data: reportsData, isLoading } = useApprovalReports(
    currentOutlet?.id ?? 0,
    date?.from ? format(date.from, 'yyyy-MM-dd') : '',
    date?.to ? format(date.to, 'yyyy-MM-dd') : ''
  )

  // Menggunakan format data yang benar
  const reports = reportsData || { approved: [], rejected: [] }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Persetujuan Penyesuaian Stok</CardTitle>
        <CardDescription>
          Laporan persetujuan dan penolakan penyesuaian stok
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM yyyy", { locale: id })} - {format(date.to, "dd MMM yyyy", { locale: id })}
                    </>
                  ) : (
                    format(date.from, "dd MMM yyyy", { locale: id })
                  )
                ) : (
                  <span>Pilih periode</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="approved" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="approved">Disetujui</TabsTrigger>
            <TabsTrigger value="rejected">Ditolak</TabsTrigger>
          </TabsList>

          <TabsContent value="approved">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Perubahan</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Disetujui Oleh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Memuat data...</TableCell>
                    </TableRow>
                  ) : reports.approved && reports.approved.length > 0 ? (
                    reports.approved.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.approved_at ? format(new Date(item.approved_at), "dd MMM yyyy", { locale: id }) : '-'}</TableCell>
                        <TableCell>{item.product?.sku || '-'}</TableCell>
                        <TableCell>{item.product?.name || '-'}</TableCell>
                        <TableCell className={item.quantity_change > 0 ? "text-green-600" : "text-red-600"}>
                          {item.quantity_change > 0 ? `+${item.quantity_change}` : item.quantity_change}
                        </TableCell>
                        <TableCell>{item.notes || '-'}</TableCell>
                        <TableCell>{item.approver?.name || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Tidak ada data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Perubahan</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Ditolak Oleh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Memuat data...</TableCell>
                    </TableRow>
                  ) : reports.rejected && reports.rejected.length > 0 ? (
                    reports.rejected.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.approved_at ? format(new Date(item.approved_at), "dd MMM yyyy", { locale: id }) : '-'}</TableCell>
                        <TableCell>{item.product?.sku || '-'}</TableCell>
                        <TableCell>{item.product?.name || '-'}</TableCell>
                        <TableCell className={item.quantity_change > 0 ? "text-green-600" : "text-red-600"}>
                          {item.quantity_change > 0 ? `+${item.quantity_change}` : item.quantity_change}
                        </TableCell>
                        <TableCell>{item.notes || '-'}</TableCell>
                        <TableCell>{item.approver?.name || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Tidak ada data</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}