"use client";

import { useState } from "react";
import { useOutlet } from "@/contexts/outlet-context";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Download,
  FileText,
  LucideLineChart,
  Printer,
  Store,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import custom icons instead of using the custom components
import { DollarSign } from "@/components/ui/dollar-sign";
import { CreditCard } from "@/components/ui/credit-card";
import { Receipt } from "@/components/ui/receipt";
import { Package } from "@/components/ui/package";
import VisuallyHidden from "@/components/ui/visually-hidden";

const salesData = [
  { name: "Jan", total: 150000000 },
  { name: "Feb", total: 140000000 },
  { name: "Mar", total: 170000000 },
  { name: "Apr", total: 180000000 },
  { name: "Mei", total: 165000000 },
  { name: "Jun", total: 190000000 },
  { name: "Jul", total: 185000000 },
  { name: "Agu", total: 195000000 },
  { name: "Sep", total: 200000000 },
  { name: "Okt", total: 210000000 },
  { name: "Nov", total: 220000000 },
  { name: "Des", total: 250000000 },
];

const stockTrendData = [
  { name: "Minggu 1", stock: 120 },
  { name: "Minggu 2", stock: 100 },
  { name: "Minggu 3", stock: 80 },
  { name: "Minggu 4", stock: 140 },
];

const topProductsData = [
  {
    id: 1,
    name: "Produk A",
    category: "Kategori 1",
    sales: 450,
    revenue: 11250000,
  },
  {
    id: 2,
    name: "Produk D",
    category: "Kategori 3",
    sales: 380,
    revenue: 17100000,
  },
  {
    id: 3,
    name: "Produk B",
    category: "Kategori 2",
    sales: 320,
    revenue: 11200000,
  },
  {
    id: 4,
    name: "Produk F",
    category: "Kategori 1",
    sales: 280,
    revenue: 18200000,
  },
  {
    id: 5,
    name: "Produk H",
    category: "Kategori 2",
    sales: 250,
    revenue: 21250000,
  },
];

const monthlyReportsData = [
  {
    id: 1,
    month: "Januari",
    year: "2023",
    totalSales: 150000000,
    totalTransactions: 3000,
    avgTicket: 50000,
  },
  {
    id: 2,
    month: "Februari",
    year: "2023",
    totalSales: 140000000,
    totalTransactions: 2800,
    avgTicket: 50000,
  },
  {
    id: 3,
    month: "Maret",
    year: "2023",
    totalSales: 170000000,
    totalTransactions: 3400,
    avgTicket: 50000,
  },
];

export default function ReportsPage() {
  const { currentOutlet, outlets } = useOutlet();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "overview";

  const [date, setDate] = useState<Date>(new Date());
  const [selectedOutletId, setSelectedOutletId] = useState<string>("all");
  const [reportType, setReportType] = useState<string>("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>("march");

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/reports?tab=${value}`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Laporan dan Analitik
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">Januari 2023</SelectItem>
              <SelectItem value="february">Februari 2023</SelectItem>
              <SelectItem value="march">Maret 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Outlet</SelectItem>
              {outlets.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id.toString()}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipe Laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentOutlet && selectedOutletId !== "all" && (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>
            Menampilkan laporan untuk: {currentOutlet.name}
          </AlertTitle>
          <AlertDescription>
            Data yang ditampilkan adalah khusus untuk outlet{" "}
            {currentOutlet.name}.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        {/* <VisuallyHidden>
          <TabsList className="mb-4 grid w-full grid-cols-5 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Penjualan</TabsTrigger>
            <TabsTrigger value="stock">Stok</TabsTrigger>
            <TabsTrigger value="monthly">Laporan Bulanan</TabsTrigger>
            <TabsTrigger value="outlets">Perbandingan Outlet</TabsTrigger>
          </TabsList>
        </VisuallyHidden> */}

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Penjualan (Maret)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 170.000.000</div>
                <p className="text-xs text-muted-foreground">
                  +21.4% dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transaksi (Maret)
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,400</div>
                <p className="text-xs text-muted-foreground">
                  +21.4% dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rata-rata Transaksi
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 50.000</div>
                <p className="text-xs text-muted-foreground">
                  +0.0% dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Produk Terjual
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tren Penjualan</CardTitle>
                <CardDescription>
                  Penjualan bulanan selama 12 bulan terakhir
                  {selectedOutletId !== "all" &&
                    currentOutlet &&
                    ` untuk ${currentOutlet.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                    />
                    <Bar
                      dataKey="total"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
                <CardDescription>
                  Top 5 produk dengan penjualan tertinggi
                  {selectedOutletId !== "all" &&
                    currentOutlet &&
                    ` di ${currentOutlet.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-right">Terjual</TableHead>
                      <TableHead className="text-right">Pendapatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProductsData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.category}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {product.sales}
                        </TableCell>
                        <TableCell className="text-right">
                          Rp {product.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Penjualan</CardTitle>
              <CardDescription>
                Detail penjualan per periode
                {selectedOutletId !== "all" &&
                  currentOutlet &&
                  ` untuk ${currentOutlet.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Harian</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "MMMM yyyy", { locale: id })
                          ) : (
                            <span>Pilih bulan</span>
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
                </div>
                <Button>
                  <LucideLineChart className="mr-2 h-4 w-4" />
                  Tampilkan Grafik
                </Button>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Transaksi</TableHead>
                    <TableHead className="text-right">Penjualan</TableHead>
                    <TableHead className="text-right">Rata-rata</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((item, index) => (
                    <TableRow key={`sales-${index}`}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">
                        {Math.floor(item.total / 50000)}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {item.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">Rp 50.000</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Stok</CardTitle>
              <CardDescription>
                Tren stok dan pergerakan produk
                {selectedOutletId !== "all" &&
                  currentOutlet &&
                  ` di ${currentOutlet.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "MMMM yyyy", { locale: id })
                          ) : (
                            <span>Pilih bulan</span>
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
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={stockTrendData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Produk Dengan Perputaran Cepat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead className="text-right">
                            Perputaran
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Produk A</TableCell>
                          <TableCell className="text-right">4.5x</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Produk D</TableCell>
                          <TableCell className="text-right">3.8x</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Produk F</TableCell>
                          <TableCell className="text-right">3.2x</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Produk Dengan Perputaran Lambat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead className="text-right">
                            Perputaran
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Produk C</TableCell>
                          <TableCell className="text-right">0.8x</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Produk G</TableCell>
                          <TableCell className="text-right">1.1x</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Produk E</TableCell>
                          <TableCell className="text-right">1.3x</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Bulanan</CardTitle>
              <CardDescription>
                Laporan lengkap per bulan
                {selectedOutletId !== "all" &&
                  currentOutlet &&
                  ` untuk ${currentOutlet.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bulan</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead className="text-right">
                      Total Transaksi
                    </TableHead>
                    <TableHead className="text-right">
                      Total Penjualan
                    </TableHead>
                    <TableHead className="text-right">
                      Rata-rata Transaksi
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReportsData.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.month}</TableCell>
                      <TableCell>{report.year}</TableCell>
                      <TableCell className="text-right">
                        {report.totalTransactions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {report.totalSales.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {report.avgTicket.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outlets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Performa Outlet</CardTitle>
              <CardDescription>
                Bandingkan performa antar outlet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={outlets.map((outlet) => ({
                      name: outlet.name,
                      penjualan: Math.floor(
                        Math.random() * 100000000 + 50000000,
                      ),
                    }))}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                    />
                    <Bar
                      dataKey="penjualan"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Outlet</TableHead>
                    <TableHead className="text-right">
                      Penjualan Bulan Ini
                    </TableHead>
                    <TableHead className="text-right">Transaksi</TableHead>
                    <TableHead className="text-right">
                      Rata-rata Transaksi
                    </TableHead>
                    <TableHead className="text-right">YoY Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outlets.map((outlet) => (
                    <TableRow key={outlet.id}>
                      <TableCell className="font-medium">
                        {outlet.name}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp{" "}
                        {(Math.random() * 100000000 + 50000000)
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </TableCell>
                      <TableCell className="text-right">
                        {Math.floor(Math.random() * 1000 + 500)}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp{" "}
                        {(Math.random() * 100000 + 50000)
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            Math.random() > 0.3
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {Math.random() > 0.3 ? "+" : ""}
                          {(
                            Math.random() * 30 -
                            (Math.random() > 0.3 ? 0 : 10)
                          ).toFixed(1)}
                          %
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
