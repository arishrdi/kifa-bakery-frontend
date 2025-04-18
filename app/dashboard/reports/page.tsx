"use client";

import { useState, useEffect } from "react";
import  html2canvas  from 'html2canvas';
import { DateRange } from "react-day-picker"
import { getCookie } from "cookies-next";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { PackageOpen, PackageCheck, PackageMinus, PackagePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getSalesByCategory, getSalesDaily  } from "@/services/report-service";
import { useOutlet } from "@/contexts/outlet-context";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
  SelectGroup,
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
import { startOfMonth, endOfDay, format } from "date-fns";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [selectedOutletId, setSelectedOutletId] = useState<string>("1");
  const [reportType, setReportType] = useState<string>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [monthlyReportsData, setMonthlyReportsData] = useState([]);
  // const [selectedMonth, setSelectedMonth] = useState<string>("march");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedReportType, setSelectedReportType] = useState<string>("monthly");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [productsData, setProductsData] = useState([]);

  const [summaryData, setSummaryData] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)), // Tanggal 1 bulan ini
    to: new Date() // Hari ini
  });

  const outletId = 1;

  const { data } = useQuery(getSalesByCategory(outletId, dateRange));
  
  const { data: salesData } = useQuery({
    ...getSalesDaily(outletId),
  });

  // const { 
  //   data: categoryData, 
  //   isLoading: isLoadingCategories,
  //   error: categoryError
  // } = useQuery(getSalesByCategory(outletId, dateRange));
  
  // const { 
  //   data: dailyData,
  //   isLoading: isLoadingDaily,
  //   error: dailyError
  // } = useQuery(getSalesDaily(outletId));

  // const { data } = useQuery({
  //   queryKey: ['getSalesByCategory', outletId, dateRange],
  //   queryFn: () => getSalesByCategory(outletId, dateRange),
  // });

  const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
    setDateRange(newRange);
  };
  
  const [sortConfig, setSortConfig] = useState({
    key: 'total_sales',
    direction: 'desc'
  });
  const [monthlySortConfig, setMonthlySortConfig] = useState({
    key: 'month', 
    direction: 'asc'
  });

  useEffect(() => {
    if (selectedOutletId) {
      fetchProductsData();
    } else if (selectedOutletId) {
      handleStockChange();
    }
  }, [selectedOutletId]);

  // Mendapatkan bulan saat ini dalam format yang sesuai dengan monthOptions
const getCurrentMonth = () => {
  const date = new Date();
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  return monthNames[date.getMonth()];
};

// Menggunakan bulan saat ini sebagai nilai default
// const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
const [selectedMonth, setSelectedMonth] = useState<string>();
  const handleShowDetail = (report: any) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const [inventoryData, setInventoryData] = useState({
    data: {
      products: [],
      summary: {
        total_saldo_awal: 0,
        total_stock_masuk: 0,
        total_stock_keluar: 0,
        total_stock_akhir: 0
      },
      periode: {
        start_date: '',
        end_date: ''
      },
      outlet: ''
    }
  });

  const getFormattedDateRange = (date: Date, type: string) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    switch (type) {
      case "daily":
        return format(date, "yyyy-MM-dd");
      case "weekly":
        // Mendapatkan tanggal awal dan akhir minggu
        const startOfWeek = startOfWeek(date);
        const endOfWeek = endOfWeek(date);
        return `${format(startOfWeek, "yyyy-MM-dd")}/${format(endOfWeek, "yyyy-MM-dd")}`;
      case "monthly":
        return `${year}-${month.toString().padStart(2, '0')}`;
      case "yearly":
        return year.toString();
      default:
        return format(date, "yyyy-MM-dd");
    }
  };

  const token = getCookie("access_token");

  // const currentOutlet = outlets.find(outlet => outlet.id === selectedOutletId);

  const handleTabChange = (value: string) => {
    router.push(`/dashboard/reports?tab=${value}`);
  };

  const getMonthName = (monthNumber) => {
    const months = {
      1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
      5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
      9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
    };
    return months[monthNumber] || '';
  };

  type MonthOption = {
  value: string;
  label: string;
  numeric: number;
};

const monthOptions: MonthOption[] = [
  { value: "january", label: "Januari 2025", numeric: 1 },
  { value: "february", label: "Februari 2025", numeric: 2 },
  { value: "march", label: "Maret 2025", numeric: 3 },
  { value: "april", label: "April 2025", numeric: 4 },
  { value: "may", label: "Mei 2025", numeric: 5 },
  { value: "june", label: "Juni 2025", numeric: 6 },
  { value: "july", label: "Juli 2025", numeric: 7 },
  { value: "august", label: "Agustus 2025", numeric: 8 },
  { value: "september", label: "September 2025", numeric: 9 },
  { value: "october", label: "Oktober 2025", numeric: 10 },
  { value: "november", label: "November 2025", numeric: 11 },
  { value: "december", label: "Desember 2025", numeric: 12 },
];

  // const handleShowDetail = (report: any) => {
  //   setSelectedReport(report);
  //   setIsDetailModalOpen(true);
  // };

// Print function for Stock tab
const handlePrintStockReport = () => {
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-1000px';
  printFrame.style.left = '-1000px';
  document.body.appendChild(printFrame);

  const currentDate = format(new Date(), 'dd/MM/yy - dd/MM/yy', { locale: id });
  const outletName = currentOutlet ? currentOutlet.name : 'Semua Outlet';
  const periodeText = inventoryData.data?.periode 
    ? `${format(new Date(inventoryData.data.periode.start_date), 'dd/MM/yy')} - ${format(new Date(inventoryData.data.periode.end_date), 'dd/MM/yy')}`
    : format(selectedDate, 'dd/MM/yy', { locale: id });

  // Use your actual Kifa Bakery logo base64 here
  // const logoSrc = ""/>


  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Daftar Jual Per Item Per Pelanggan</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 15px;
          color: #333;
        }
        .header { 
          display: flex;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #000;
        }
        .logo-container {
          width: 80px;
          height: 80px; /* tambahkan tinggi tetap */
          margin-right: 15px;
          display: flex;
          align-items: center; /* pusatkan vertikal */
        }
        .logo {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          opacity: 0.8;
        }
        .header-content {
          flex-grow: 1;
        }
        .title { 
          font-size: 16px; 
          font-weight: bold;
          margin-bottom: 5px;
        }
        .address {
          font-size: 12px;
          margin-bottom: 2px;
        }
        .phone {
          font-size: 12px;
        }
        .periode {
          text-align: right;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 12px;
        }
        th, td {
          padding: 8px 12px;
          text-align: left;
          border: 1px solid #ddd;
        }
        th { 
          background-color:rgb(255, 255, 255); 
          font-weight: bold;
          text-align: center;
        }
        .text-right { 
          text-align: right; 
        }
        .text-center {
          text-align: center;
        }
        .summary {
          margin-top: 20px;
          font-weight: bold;
          background-color:rgb(255, 255, 255);
          padding: 10px;
          border-radius: 4px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-size: 11px;
          color: #666;
          text-align: center;
        }
        @media print {
          body { 
            padding: 10px;
            -webkit-print-color-adjust: exact; 
          }
          th { 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png" alt="Logo kifa" class="logo" />
        </div>
        <div class="header-content">
          <div class="title">DAFTAR JUAL PER ITEM PER PELANGGAN</div>
          <div class="subtitle">
            Outlet: ${outletName}
          </div>
          <div class="subtitle">
            Periode: ${periodeText}
          </div>
          <div class="date">
            Dicetak pada: ${currentDate}
          </div>
          <div class="phone">0858-6409-3750</div>
        </div>
        <div class="periode">
          PERIODE : ${periodeText}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="text-center">No</th>
            <th>Produk</th>
            <th class="text-right">Saldo Awal</th>
            <th class="text-right">Stock Masuk</th>
            <th class="text-right">Stock Keluar</th>
            <th class="text-right">Stock Akhir</th>
          </tr>
        </thead>
        <tbody>
          ${inventoryData.data?.products?.map((product, index) => `
            <tr>
              <td class="text-center">${index + 1}</td>
              <td>${product.product_name || '-'}</td>
              <td class="text-right">${product.saldo_awal?.toLocaleString() || '0'}</td>
              <td class="text-right">${product.stock_masuk?.toLocaleString() || '0'}</td>
              <td class="text-right">${product.stock_keluar?.toLocaleString() || '0'}</td>
              <td class="text-right">${product.stock_akhir?.toLocaleString() || '0'}</td>
            </tr>
          `).join('') || '<tr><td colspan="6" class="text-center">Tidak ada data stok</td></tr>'}
        </tbody>
        <tfoot>
          <tr class="summary">
            <td colspan="2">TOTAL</td>
            <td class="text-right">${inventoryData.data?.summary?.total_saldo_awal?.toLocaleString() || '0'}</td>
            <td class="text-right">${inventoryData.data?.summary?.total_stock_masuk?.toLocaleString() || '0'}</td>
            <td class="text-right">${inventoryData.data?.summary?.total_stock_keluar?.toLocaleString() || '0'}</td>
            <td class="text-right">${inventoryData.data?.summary?.total_stock_akhir?.toLocaleString() || '0'}</td>
          </tr>
        </tfoot>
      </table>

      <div class="footer">
        <p>Laporan ini dibuat secara otomatis oleh Sistem Manajemen Inventori</p>
        <p>© ${new Date().getFullYear()} Kifa Bakery</p>
      </div>
    </body>
    </html>
  `;

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(printContent);
  frameDoc.close();

  printFrame.onload = function() {
    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (error) {
        console.error('Gagal mencetak:', error);
      } finally {
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }
    }, 500);
  };
};

// Helper function to generate chart image (you'll need to implement this)
const generateStockChartImage = async () => {
  // Get the chart element (you'll need to add a ref to your chart)
  const chartElement = document.querySelector('.recharts-wrapper');
  if (!chartElement) return '';
  
  try {
    const canvas = await html2canvas(chartElement as HTMLElement);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to generate chart image:', error);
    return '';
  }
};

function StatCard({ title, value, icon }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

//handle print
const handlePrint = () => {
  if (tab === "monthly") {
    handlePrintMonthlyReport();
  } else if (tab === "stock") {
    handlePrintStockReport();
  } else if (tab === "kategori") {
    handlePrintCategoriesReport();
  } else if (tab === "dailySales") {
    handlePrintDailySalesReport();
  }
};

// handle export csv
const handleExport = () => {
  if (tab === "monthly") {
    handleExportMonthlyCSV();
  } else if (tab === "stock") {
    handleExportStockCSV();
  } else if (tab === "kategori") {
    handleExportCategoriesCSV();
  } else if (tab === "dailySales") {
    handleExportDailySalesCSV();
  }
};

  // Print penjualan per item
  const handlePrintMonthlyReport = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-1000px';
    printFrame.style.left = '-1000px';
    document.body.appendChild(printFrame);
  
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
    const outletName = currentOutlet ? currentOutlet.name : 'Semua Outlet';
    const startDate = format(dateRange.from, 'dd MMMM yyyy', { locale: id });
    const endDate = format(dateRange.to, 'dd MMMM yyyy', { locale: id });
  
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Penjualan per Item</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 15px;
            color: #333;
          }
          .header { 
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;
          }
          .logo-container {
            width: 70px;
            margin-right: 15px;
          }
          .logo {
            width: 100%;
            height: auto;
          }
          .header-content {
            flex: 1;
          }
          .title { 
            font-size: 18px; 
            font-weight: bold;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 13px;
            color: #555;
            margin-bottom: 3px;
          }
          .date {
            font-size: 12px;
            color: #777;
          }
          .stats-summary {
            margin: 15px 0;
            padding: 15px;
            background-color:rgb(255, 255, 255);
            border-radius: 5px;
          }
          .stat-item {
            margin-bottom: 8px;
            display: flex;
          }
          .stat-label {
            font-weight: bold;
            width: 180px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 13px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th { 
            background-color:rgb(255, 255, 255);
            font-weight: bold;
          }
          .text-right { 
            text-align: right; 
          }
          .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          @media print {
            body { 
              padding: 10px;
              -webkit-print-color-adjust: exact; 
            }
            .stats-summary, th { 
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png" 
                 alt="Logo Kifa" 
                 class="logo">
          </div>
          <div class="header-content">
            <div class="title">LAPORAN PENJUALAN per Item</div>
            <div class="subtitle">Outlet: ${outletName}</div>
            <div class="subtitle">Periode: ${startDate} - ${endDate}</div>
            <div class="date">Dicetak pada: ${currentDate}</div>
          </div>
        </div>
  
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-label">Total Penjualan:</span>
            <span>Rp ${summaryData.total_sales.toLocaleString()}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Kuantitas:</span>
            <span>${summaryData.total_quantity.toLocaleString()} item</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Transaksi:</span>
            <span>${summaryData.total_orders.toLocaleString()}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Rata-rata/Transaksi:</span>
            <span>Rp ${summaryData.average_order_value.toLocaleString()}</span>
          </div>
        </div>
  
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nama Item</th>
              <th>Jenis</th>
              <th class="text-right">Jumlah Satuan</th>
              <th class="text-right">Total Harga</th>
            </tr>
          </thead>
          <tbody>
            ${productsData.map(product => `
              <tr>
                <td>${product.sku}</td>
                <td>${product.product_name}</td>
                <td>${product.category_name || '-'}</td>
                <td class="text-right">${product.total_quantity.toLocaleString()}</td>
                <td class="text-right">Rp ${product.total_sales.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
  
        <div class="footer">
          <p>Laporan ini dibuat otomatis oleh Sistem Manajemen Penjualan</p>
          <p>© ${new Date().getFullYear()} Kifa Bakery</p>
        </div>
      </body>
      </html>
    `;
  
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();
  
    printFrame.onload = function() {
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (error) {
          console.error('Gagal mencetak:', error);
        } finally {
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }
      }, 500);
    };
  };

    // export penjualan per item
    const handleExportMonthlyCSV = () => {
      if (!productsData || !productsData.length) return;
    
      // Header dengan informasi laporan
      const reportHeader = [
        ['LAPORAN PRODUK BERDASARKAN RENTANG TANGGAL'],
        [`Outlet: ${currentOutlet?.name || 'Semua Outlet'}`],
        [`Periode: ${format(dateRange.from, 'dd MMMM yyyy', { locale: id })} - ${format(dateRange.to, 'dd MMMM yyyy', { locale: id })}`],
        [`Tanggal Ekspor: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`],
        [], // Baris kosong untuk spacing
      ];
    
      // Header ringkasan
      // const summaryHeader = ['RINGKASAN'];
      // const summaryData = [
      //   ['Total Penjualan (Rp)', `Rp ${summaryData.total_sales.toLocaleString('id-ID')}`],
      //   ['Total Kuantitas', summaryData.total_quantity.toLocaleString('id-ID')],
      //   ['Total Transaksi', summaryData.total_orders.toLocaleString('id-ID')],
      //   ['Rata-rata per Transaksi (Rp)', `Rp ${summaryData.average_order_value.toLocaleString('id-ID')}`],
      // ];
    
      // // Format untuk data ringkasan
      // const formattedSummaryData = summaryData.map(row => row.join(','));
      
      // Baris kosong untuk spacing
      const spacing = [''];
    
      // Data produk
      const productsHeader = ['DATA PRODUK'];
      const productsColumns = [
        'No', 
        'SKU', 
        'Nama Item', 
        'Jenis',
        // 'Jumlah Order',
        'Jumlah Satuan',
        'Total Harga (Rp)',
        // 'Kontribusi (%)'
      ];
      
      const productsRows = productsData.map((product, index) => [
        index + 1,
        product.sku,
        product.product_name,
        product.category_name || '-',
        product.order_count,
        product.total_quantity,
        product.total_sales,
        // product.sales_percentage
      ]);
    
      // Format angka dengan separator ribuan
      const formattedProductsRows = productsRows.map(row => [
        row[0], // No
        `"${row[1]}"`, // SKU
        `"${row[2]}"`, // Nama Produk
        `"${row[3]}"`, // Kategori
        // `"${row[4].toLocaleString('id-ID')}"`, // Jumlah Order
        `"${row[5].toLocaleString('id-ID')}"`, // Total Kuantitas
        `"Rp ${row[6].toLocaleString('id-ID')}"`, // Total Penjualan
        // `"${row[7]}%"`, // Kontribusi
      ]);
    
      // Gabungkan semua bagian
      const csvContent = [
        ...reportHeader,
        // summaryHeader,
        // ...formattedSummaryData,
        summaryData,
        spacing,
        productsHeader,
        productsColumns,
        ...formattedProductsRows,
      ]
        .map(row => Array.isArray(row) ? row.join(',') : row)
        .join('\n');
    
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Laporan_Produk_${currentOutlet?.name || 'All'}_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  //export stock
  const handleExportStockCSV = () => {
    if (!inventoryData?.data) return;
  
    // Informasi header dengan logo (placeholder)
    const companyInfo = [
      // ['KIFA BAKERY', '', '', '', '', ''],
      [`Outlet: ${inventoryData.data.outlet || 'Semua Outlet'}`],
      [`Periode: ${inventoryData.data.periode.start_date} s/d ${inventoryData.data.periode.end_date}`],
      // ['', '', '', '', '', `Tanggal Ekspor: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`],
      [], // Baris kosong
    ];
  
    // Header tabel
    const tableHeader = [
      ['No', 'Produk', 'Saldo Awal', 'Stock Masuk', 'Stock Keluar', 'Stock Akhir'],
    ];
  
    // Data produk
    const tableRows = inventoryData.data.products.map((product, index) => [
      index + 1,
      product.product_name,
      product.saldo_awal,
      product.stock_masuk,
      product.stock_keluar,
      product.stock_akhir,
    ]);
  
    // Footer dengan summary
    const tableFooter = [
      [], // Baris kosong
      ['TOTAL', '', 
       inventoryData.data.summary.total_saldo_awal,
       inventoryData.data.summary.total_stock_masuk,
       inventoryData.data.summary.total_stock_keluar,
       inventoryData.data.summary.total_stock_akhir
      ],
    ];
  
    // Gabungkan semua bagian
    const csvContent = [
      ...companyInfo,
      ...tableHeader,
      ...tableRows,
      ...tableFooter,
    ]
      .map(row => 
        row.map(cell => {
          // Handle nilai number untuk format Excel
          if (typeof cell === 'number') return cell;
          // Quote string yang mengandung koma
          if (typeof cell === 'string' && cell.includes(',')) return `"${cell}"`;
          return cell;
        }).join(',')
      )
      .join('\n');
  
    // Create and download file
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute(
      'download', 
      `Laporan_Stok_${inventoryData.data.outlet.replace(/ /g, '_') || 'All'}_${format(new Date(), 'yyyyMMdd')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //print penjualan per kategori
  const handlePrintCategoriesReport = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-1000px';
    printFrame.style.left = '-1000px';
    document.body.appendChild(printFrame);
  
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
    const outletName = currentOutlet ? currentOutlet.name : 'Semua Outlet';
    const startDate = format(dateRange.from, 'dd MMMM yyyy', { locale: id });
    const endDate = format(dateRange.to, 'dd MMMM yyyy', { locale: id });
  
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Penjualan Per Kategori</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 15px;
            color: #333;
          }
          .header { 
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;
          }
          .logo-container {
            width: 70px;
            margin-right: 15px;
          }
          .logo {
            width: 100%;
            height: auto;
          }
          .header-content {
            flex: 1;
          }
          .title { 
            font-size: 18px; 
            font-weight: bold;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 13px;
            color: #555;
            margin-bottom: 3px;
          }
          .date {
            font-size: 12px;
            color: #777;
          }
          .stats-summary {
            margin: 15px 0;
            padding: 15px;
            background-color:rgb(255, 255, 255);
            border-radius: 5px;
          }
          .stat-item {
            margin-bottom: 8px;
            display: flex;
          }
          .stat-label {
            font-weight: bold;
            width: 180px;
          }
          .category-header {
            background-color:rgb(255, 255, 255);
            padding: 12px 15px;
            margin-top: 25px;
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            border: 1px solid #ddd;
            border-bottom: none;
          }
          .category-name {
            font-weight: bold;
            font-size: 15px;
          }
          .category-meta {
            color: #666;
            font-size: 13px;
            margin-top: 3px;
          }
          .category-sales {
            text-align: right;
            font-weight: bold;
          }
          .category-percentage {
            color: #666;
            text-align: right;
            font-size: 13px;
            margin-top: 3px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 0 25px 0;
            font-size: 13px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th { 
            background-color:rgb(255, 255, 255); 
            font-weight: bold;
          }
          .text-right { 
            text-align: right; 
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
          .summary-item {
            margin-bottom: 8px;
          }
          .summary-label {
            color: #666;
            font-size: 13px;
            margin-bottom: 5px;
          }
          .summary-value {
            font-weight: bold;
            font-size: 15px;
          }
          @media print {
            body { 
              padding: 10px;
              -webkit-print-color-adjust: exact; 
            }
            .stats-summary, th, .category-header, .summary-grid { 
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png" 
                 alt="Logo Kifa" 
                 class="logo">
          </div>
          <div class="header-content">
            <div class="title">LAPORAN PENJUALAN PER KATEGORI</div>
            <div class="subtitle">Outlet: ${outletName}</div>
            <div class="subtitle">Periode: ${startDate} - ${endDate}</div>
            <div class="date">Dicetak pada: ${currentDate}</div>
          </div>
        </div>
  
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Kategori</div>
            <div class="summary-value">${data.data.summary.total_categories}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Produk Terjual</div>
            <div class="summary-value">${data.data.summary.total_products}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Kuantitas</div>
            <div class="summary-value">${data.data.summary.total_quantity}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Penjualan</div>
            <div class="summary-value">Rp ${Number(data.data.summary.total_sales).toLocaleString('id-ID')}</div>
          </div>
        </div>
  
        ${data.data.categories.map(category => `
          <div>
            <div class="category-header">
              <div>
                <div class="category-name">${category.category_name}</div>
                <div class="category-meta">${category.products.length} produk terjual</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Nama Item</th>
                  <th class="text-right">Kode Item</th>
                  <th class="text-right">Jenis</th>
                  <th class="text-right">Jumlah</th>
                  <th class="text-left">Satuan</th>
                  <th class="text-right">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                ${category.products.map(product => `
                  <tr>
                    <td>${product.product_name}</td>
                    <td class="text-right">${product.product_sku}</td>
                    <td class="text-right">${category.category_name}</td>
                    <td class="text-right">${Number(product.quantity)}</td>                    
                    <td class="text-left">${product.product_unit}</td>                    
                    <td class="text-right">Rp ${Number(product.sales).toLocaleString('id-ID')}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right" style="font-weight: bold;">Total</td>
                  <td class="text-right" style="font-weight: bold;"> ${Number(category.total_quantity)}</td>
                  <td colspan="2" class="text-right" style="font-weight: bold;">Rp ${Number(category.total_sales).toLocaleString('id-ID')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        `).join('')}
  
        <div class="footer">
          <p>Laporan ini dibuat otomatis oleh Sistem Manajemen Penjualan</p>
          <p>© ${new Date().getFullYear()} Kifa Bakery</p>
        </div>
      </body>
      </html>
    `;
  
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();
  
    printFrame.onload = function() {
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (error) {
          console.error('Gagal mencetak:', error);
        } finally {
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }
      }, 500);
    };
  };

  //export penjualan per kategori
  const handleExportCategoriesCSV = () => {
    if (!data?.data?.categories || !data.data.categories.length) return;
  
    // Header dengan informasi laporan
    const reportHeader = [
      ['LAPORAN PENJUALAN PER KATEGORI'],
      [`Outlet: ${currentOutlet?.name || 'Semua Outlet'}`],
      [`Periode: ${format(dateRange.from, 'dd MMMM yyyy', { locale: id })} - ${format(dateRange.to, 'dd MMMM yyyy', { locale: id })}`],
      [`Tanggal Ekspor: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`],
      [], // Baris kosong untuk spacing
    ];
  
    // Header ringkasan
    const summaryHeader = ['RINGKASAN'];
    const summaryData = [
      ['Total Kategori', data.data.summary.total_categories],
      ['Total Produk Terjual', data.data.summary.total_products],
      ['Total Kuantitas', data.data.summary.total_quantity],
      ['Total Penjualan (Rp)', `Rp ${Number(data.data.summary.total_sales).toLocaleString('id-ID')}`],
    ];
  
    // Format untuk data ringkasan
    const formattedSummaryData = summaryData.map(row => row.join(','));
    
    // Baris kosong untuk spacing
    const spacing = [''];
  
    // Gabungkan semua bagian
    let csvContent = [
      ...reportHeader,
      summaryHeader,
      ...formattedSummaryData,
      spacing,
    ];
  
    // Tambahkan data untuk setiap kategori
    data.data.categories.forEach(category => {
      // Header kategori
      csvContent.push([`KATEGORI: ${category.category_name}`]);
      csvContent.push([
        `Total Penjualan Kategori: Rp ${Number(category.total_sales).toLocaleString('id-ID')}`,
        `Persentase dari Total: ${category.sales_percentage.toFixed(2)}%`,
        `Jumlah Produk: ${category.products.length}`
      ]);
      csvContent.push(spacing);
  
      // Kolom data produk per kategori
      csvContent.push([
        'No', 
        'Nama Item',
        'Jenis',
        'SKU', 
        'Jumlah',
        'Satuan',
        'Total Harga (Rp)',
        // 'Persentase dari Kategori (%)'
      ]);
      
      // Data produk per kategori
      category.products.forEach((product, index) => {
        csvContent.push([
          index + 1,
          `"${product.product_name}"`,
          `"${category.category_name}"`,
          `"${product.product_sku}"`,
          `"${Number(product.quantity).toLocaleString('id-ID')}"`,
          `"${product.product_unit}"`,
          `"Rp ${Number(product.sales).toLocaleString('id-ID')}"`,
          // `"${product.sales_percentage.toFixed(2)}%"`
        ]);
      });
      
      csvContent.push(spacing);
      csvContent.push(spacing);
    });
  
    // Ubah array menjadi format CSV
    const csvString = csvContent
      .map(row => Array.isArray(row) ? row.join(',') : row)
      .join('\n');
  
    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Kategori_${currentOutlet?.name || 'All'}_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //print penjualan harian
  const handlePrintDailySalesReport = () => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-1000px';
    printFrame.style.left = '-1000px';
    document.body.appendChild(printFrame);
  
    const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
    const outletName = currentOutlet ? currentOutlet.name : 'Semua Outlet';
    const reportDate = date ? format(date, 'dd MMMM yyyy', { locale: id }) : format(new Date(), 'dd MMMM yyyy', { locale: id });
  
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Penjualan Harian</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 15px; color: #333; }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;
          }
          .logo-container {
            width: 70px;
            margin-right: 15px;
          }
          .logo {
            width: 100%;
            height: auto;
          }
          .header-content {
            flex: 1;
          }
          .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 13px;
            color: #555;
            margin-bottom: 3px;
          }
          .date {
            font-size: 12px;
            color: #777;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
            padding: 20px;
            background-color:rgb(255, 255, 255);
            border-radius: 8px;
          }
          .summary-item { margin-bottom: 10px; }
          .summary-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .summary-value {
            font-weight: bold;
            font-size: 16px;
          }
          .order-container {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }
          .order-header {
            background-color:rgb(255, 255, 255);
            padding: 15px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
          }
          .order-id { font-weight: bold; font-size: 16px; }
          .order-meta {
            display: flex;
            gap: 20px;
            color: #666;
            font-size: 14px;
          }
          .order-total {
            font-weight: bold;
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color:rgb(255, 255, 255);
            font-weight: bold;
          }
          .text-right { text-align: right; }
          .payment-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            background-color:rgb(255, 255, 255);
            border: 1px solid #ddd;
            font-size: 12px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .summary-grid, th, .order-header {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-container">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0JeOFanmAshWgLBlxIH5qHVyx7okwwmeV9Wbqr9n8Aie9Gh-BqnAF0_PlfBa_ZHqnENEOz8MuPZxFYFfgvCAYF8ie3AMRW_syA0dluwZJW-jg7ZuS8aaRJ38NI2f7UFW1ePVO4kifJTbdZi0WvQFr77GyqssJzeWL2K65GPB4dZwHEkZnlab9qNKX9VSZ/s320/logo-kifa.png"
                 alt="Logo Kifa"
                 class="logo">
          </div>
          <div class="header-content">
            <div class="title">LAPORAN PENJUALAN HARIAN</div>
            <div class="subtitle">Outlet: ${outletName}</div>
            <div class="subtitle">Tanggal: ${reportDate}</div>
            <div class="date">Dicetak pada: ${currentDate}</div>
          </div>
        </div>
  
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Penjualan</div>
            <div class="summary-value">Rp ${salesData?.data.summary.total_sales.toLocaleString()}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Order</div>
            <div class="summary-value">${salesData?.data.summary.total_orders}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Item</div>
            <div class="summary-value">${salesData?.data.summary.total_items}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Rata-rata Order</div>
            <div class="summary-value">Rp ${salesData?.data.summary.average_order_value.toLocaleString()}</div>
          </div>
        </div>
  
        ${salesData?.data.orders.map((order, index) => `
          <div class="order-container ${index > 0 ? 'page-break' : ''}">
            <div class="order-header">
              <div>
                <div class="summary-label">No Transaksi</div>
                <div class="order-id">#${order.order_id}</div>
              </div>
              <div class="order-meta">
                <div>${order.order_time}</div>
                <div>Kasir: ${order.cashier}</div>
                <div class="payment-badge">${order.payment_method === 'cash' ? 'Tunai' : 'Non-Tunai'}</div>
              </div>
              <div class="order-total">
                Rp ${order.total.toLocaleString()}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nama Item</th>
                  <th>Kode Item</th>
                  <th class="text-right">Harga</th>
                  <th class="text-right">Jumlah</th>
                  <th class="text-left">Satuan</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items ? order.items.map(item => `
                  <tr>
                    <td>${item.product_name}</td>
                    <td>${item.sku || '-'}</td>
                    <td class="text-right">Rp ${item.unit_price.toLocaleString()}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-left">${item.unit}</td>
                    <td class="text-right">Rp ${(item.unit_price * item.quantity).toLocaleString()}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="5" style="text-align: center; color: #666;">Detail produk tidak tersedia</td>
                  </tr>
                `}
              </tbody>
              <tfoot>
                <tr>
                  <td class="text-right" style="font-weight: bold;">Tax</td>
                  <td class="text-right" style="font-weight: bold;">Rp ${order.tax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="4" class="text-right" style="font-weight: bold;">Total</td>
                  <td class="text-right" style="font-weight: bold;">Rp ${order.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        `).join('')}
  
        <div class="footer">
          <p>Laporan ini dibuat secara otomatis oleh sistem.</p>
          <p>© ${new Date().getFullYear()} Kifa Bakery</p>
        </div>
      </body>
      </html>
    `;
  
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();
  
    printFrame.onload = function () {
      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (error) {
          console.error('Gagal mencetak:', error);
        } finally {
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }
      }, 500);
    };
  };
  
  //export penjualan harian
  const handleExportDailySalesCSV = () => {
    // Verifikasi bahwa data penjualan tersedia
    if (!salesData || !salesData.data || !salesData.data.orders) {
      console.error('Data penjualan tidak tersedia untuk di-export');
      // toast.error('Data penjualan tidak tersedia untuk di-export');
      return;
    }
  
    try {
      // Header untuk File CSV
      let csvContent = 'Order ID,Tanggal,Waktu,Kasir,Metode Pembayaran,Produk,SKU,Harga,Kuantitas,Subtotal,Total Order\n';
  
      // Data untuk File CSV
      salesData.data.orders.forEach(order => {
        const orderDate = order.order_time.split(' ')[0]; // Mengasumsikan format "YYYY-MM-DD HH:MM:SS"
        // const orderTime = order.order_time.split(' ')[1];
        const paymentMethod = order.payment_method === 'cash' ? 'Tunai' : 'Non-Tunai';
        
        // Jika order memiliki items
        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            // Ganti koma dengan titik koma untuk menghindari konflik dengan format CSV
            const productName = item.product_name.replace(/,/g, ';');
            const productSKU = (item.sku || '-').replace(/,/g, ';');
            const price = item.unit_price;
            const quantity = item.quantity;
            const subtotal = item.unit_price * item.quantity;
            
            // Hanya tambahkan total order pada baris pertama dari setiap order
            const totalOrder = index === 0 ? order.total : '';
            
            // Baris CSV untuk setiap item
            csvContent += `"${order.order_id}","${orderDate}","${order.cashier}","${paymentMethod}","${productName}","${productSKU}",${price},${quantity},${subtotal},${totalOrder}\n`;
          });
        } else {
          // Jika tidak ada detail item, tambahkan baris dengan order info saja
          csvContent += `"${order.order_id}","${orderDate}","${orderTime}","${order.cashier}","${paymentMethod}","","","","","",${order.total}\n`;
        }
      });
  
      // Tambahkan baris ringkasan penjualan
      csvContent += `\n"RINGKASAN PENJUALAN"\n`;
      csvContent += `"Total Penjualan",${salesData.data.summary.total_sales}\n`;
      csvContent += `"Total Order",${salesData.data.summary.total_orders}\n`;
      csvContent += `"Total Item",${salesData.data.summary.total_items}\n`;
      csvContent += `"Rata-rata Order",${salesData.data.summary.average_order_value}\n`;
  
      // Buat Blob dari CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Buat nama file berdasarkan tanggal
      const reportDate = date 
        ? format(date, 'yyyy-MM-dd', { locale: id }) 
        : format(new Date(), 'yyyy-MM-dd', { locale: id });
      const outletInfo = currentOutlet ? `_${currentOutlet.name.replace(/\s+/g, '_')}` : '_Semua_Outlet';
      const fileName = `Laporan_Penjualan_Harian${outletInfo}_${reportDate}.csv`;
  
      // Download file dengan FileSaver.js jika tersedia atau metode native
      if (window.saveAs) {
        window.saveAs(blob, fileName);
      } else {
        // Pendekatan native browser untuk download
        const link = document.createElement('a');
        
        // Cek apakah browser mendukung URL.createObjectURL
        if (window.URL && window.URL.createObjectURL) {
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
          }, 100);
        } else {
          console.error('Browser tidak mendukung download CSV');
          toast.error('Browser tidak mendukung download CSV');
        }
      }
  
      // toast.success('Export CSV berhasil');
    } catch (error) {
      console.error('Gagal export CSV:', error);
      // toast.error('Gagal export CSV: ' + error.message);
    }
  };

// penjualan
  // useEffect(() => {
  //   const fetchMonthlySales = async () => {
  //     setIsLoading(true);
  //     setError(null);
      
  //     try {
  //       const outletParam = selectedOutletId || '1';
        
  //       const response = await fetch(`http://127.0.0.1:8000/api/reports/monthly-sales/${outletParam}`, {
  //         headers: {
  //           'Accept': 'application/json',
  //           'Authorization': 'Bearer ' + token,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();
        
  //       // Check if result and data exist
  //       if (!result?.data) {
  //         throw new Error("Invalid data structure");
  //       }

  //       const { data } = result;
        
  //       // Extract summary data with default values if not present
  //       const summary = data.summary || {
  //         total_sales: "0.00",
  //         total_transactions: 0,
  //         average_transaction: "0.00",
  //         report_date: null
  //       };

  //       // Format the data
  //       const formattedData = [{
  //         id: `${data.year}-${data.month}`,
  //         month: getMonthName(data.month),
  //         year: data.year,
  //         totalTransactions: summary.total_transactions,
  //         totalSales: parseFloat(summary.total_sales),
  //         avgTicket: parseFloat(summary.average_transaction),
  //         outlet: data.outlet || 'Outlet tidak tersedia'
  //       }];

  //       setMonthlyReportsData(formattedData);
        
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       setError(err.message || "Gagal memuat data penjualan");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchMonthlySales();
  // }, [selectedOutletId, token]); // Tambahkan token jika diperlukan

  const fetchProductsData = async () => {
    if (!selectedOutletId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Format dates for API
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      
      // Using the endpoint format you provided
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/monthly-sales/${selectedOutletId}?start_date=${startDate}&end_date=${endDate}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      
      const data = await response.json();
      
      if (data.status && data.data) {
        // Set products data (note the field is 'products' not 'top_products')
        setProductsData(data.data.products || []);
        
        // Set summary data if available
        if (data.data.summary) {
          setSummaryData(data.data.summary);
        }

        // You might also want to store other data like outlet name
        // setOutletName(data.data.outlet || '');
      } else {
        setProductsData([]);
        setSummaryData(null);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleShowDetail = (product) => {
  //   // Implement detail view functionality
  //   console.log('Show product detail:', product);
  // };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, direction });
    
    // Sort the data
    const sortedData = [...productsData].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    
    setProductsData(sortedData);
  };

  const handleStockChange = async () => {
    if (!selectedOutletId || !dateRange.from || !dateRange.to) {
      setError("Harap pilih outlet dan tanggal terlebih dahulu");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/monthly-inventory/${selectedOutletId}?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Full API Response:', result); // Debugging
  
      // Validasi struktur response
      if (!result?.data?.products) {
        throw new Error('Struktur data tidak valid: products tidak ditemukan');
      }
  
      // Format data untuk state
      const formattedData = {
        data: {
          outlet: result.data.outlet || "Outlet Tidak Diketahui",
          periode: result.data.periode || {
            start_date: startDate,
            end_date: endDate
          },
          products: result.data.products.map(product => ({
            ...product,
            // Pastikan semua field memiliki nilai default
            product_name: product.product_name || "Produk Tanpa Nama",
            product_code: product.product_code || "TANPA-KODE",
            saldo_awal: Number(product.saldo_awal) || 0,
            stock_masuk: Number(product.stock_masuk) || 0,
            stock_keluar: Number(product.stock_keluar) || 0,
            stock_akhir: Number(product.stock_akhir) || 0,
            stock_aktual: Number(product.stock_aktual) || 0,
            selisih: Number(product.selisih) || 0
          })),
          summary: result.data.summary || {
            total_saldo_awal: result.data.products.reduce((sum, p) => sum + (Number(p.saldo_awal) || 0), 0),
            total_stock_masuk: result.data.products.reduce((sum, p) => sum + (Number(p.stock_masuk) || 0), 0),
            total_stock_keluar: result.data.products.reduce((sum, p) => sum + (Number(p.stock_keluar) || 0), 0),
            total_stock_akhir: result.data.products.reduce((sum, p) => sum + (Number(p.stock_akhir) || 0), 0)
          }
        }
      };
  
      setInventoryData(formattedData);
  
    } catch (err) {
      console.error("Error fetching inventory data:", err);
      setError(err.message || "Gagal memuat data stok");
      
      // Set data kosong jika error
      setInventoryData({
        data: {
          outlet: "",
          periode: {
            start_date: format(dateRange.from, 'yyyy-MM-dd'),
            end_date: format(dateRange.to, 'yyyy-MM-dd')
          },
          products: [],
          summary: {
            total_saldo_awal: 0,
            total_stock_masuk: 0,
            total_stock_keluar: 0,
            total_stock_akhir: 0
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (selectedMonth && tab === "stock") {
  //     handleStockChange(selectedMonth);
  //   }
  // }, [selectedMonth, selectedOutletId, tab]);

  const handleMonthChange = async (newMonth: string) => {
    if (tab === "stock") {
      // Existing monthly report logic
      handleStockChange(newMonth);
    }
  };
  

  Date.prototype.getWeek = function() {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - firstDayOfYear) / 86400000) + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Laporan dan Analitik
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>

              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={ handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Ekspor
          </Button>
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

        <TabsContent value="dailySales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Penjualan</CardTitle>
              <CardDescription>
                Detail penjualan per hari
                {selectedOutletId !== "all" &&
                  currentOutlet &&
                  ` untuk ${currentOutlet.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
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
                  </div> */}
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        {/* <Button
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
                        </Button> */}
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

              {/* Summary Section */}
              {salesData && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium">Total Penjualan</h3>
                    <p className="text-2xl font-bold">
                      Rp {salesData?.data.summary.total_sales.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium">Total Order</h3>
                    <p className="text-2xl font-bold">
                      {salesData?.data.summary.total_orders}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium">Total Item</h3>
                    <p className="text-2xl font-bold">
                      {salesData?.data.summary.total_items}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium">Rata-rata Order</h3>
                    <p className="text-2xl font-bold">
                      Rp {salesData?.data.summary.average_order_value.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Orders Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Kasir</TableHead>
                    <TableHead>Metode Pembayaran</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData?.data.orders?.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell>#{order.order_id}</TableCell>
                      <TableCell>{order.order_time}</TableCell>
                      <TableCell>{order.cashier}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.payment_method === 'cash' ? 'Tunai' : 'Non-Tunai'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {order.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Category Sales */}
              {/* <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-4">Penjualan per Kategori</h3>
                <div className="grid grid-cols-3 gap-4">
                  {salesData?.category_sales?.map((category) => (
                    <div key={category.category_id} className="border rounded-lg p-4">
                      <h4 className="font-medium">{category.category_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {category.total_quantity} item terjual
                      </p>
                      <p className="text-primary font-bold mt-2">
                        Rp {category.total_sales.toLocaleString()}
                      </p>
                      <div className="mt-2">
                        <Progress 
                          value={category.sales_percentage} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.sales_percentage}% dari total penjualan
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Payment Method Breakdown */}
              {/* <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold mb-4">Metode Pembayaran</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(salesData?.payment_method_sales || {}).map(([method, data]) => (
                    <div key={method} className="border rounded-lg p-4">
                      <h4 className="font-medium capitalize">
                        {method === 'cash' ? 'Tunai' : method}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {data.count} transaksi
                      </p>
                      <p className="text-primary font-bold mt-2">
                        Rp {data.total.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Stok</CardTitle>
              <CardDescription>
                Perubahan stok produk
                {selectedOutletId !== "all" && currentOutlet && ` di ${currentOutlet.name}`}
              </CardDescription>
              <div className="flex justify-between items-center mt-4">
                <DateRangePicker 
                  value={dateRange} 
                  onChange={handleDateRangeChange} 
                />
                <Button onClick={handleStockChange}>
                  Terapkan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <p>Memuat data...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Periode: {inventoryData?.data?.periode.start_date} s/d {inventoryData?.data?.periode.end_date}
                    </h3>
                    
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <StatCard 
                        title="Total Saldo Awal" 
                        value={`${inventoryData?.data?.summary.total_saldo_awal} pcs`}
                        icon={<PackagePlus className="h-4 w-4" />}
                      />
                      <StatCard 
                        title="Total Stock Masuk" 
                        value={`${inventoryData?.data?.summary.total_stock_masuk} pcs`}
                        icon={<PackageOpen className="h-4 w-4" />}
                      />
                      <StatCard 
                        title="Total Stock Keluar" 
                        value={`${inventoryData?.data?.summary.total_stock_keluar} pcs`}
                        icon={<PackageMinus className="h-4 w-4" />}
                      />
                      <StatCard 
                        title="Total Stock Akhir" 
                        value={`${inventoryData?.data?.summary.total_stock_akhir} pcs`}
                        icon={<PackageCheck className="h-4 w-4" />}
                      />
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead>Satuan</TableHead>
                          <TableHead className="text-right">Saldo Awal</TableHead>
                          <TableHead className="text-right">Stock Masuk</TableHead>
                          <TableHead className="text-right">Stock Keluar</TableHead>
                          <TableHead className="text-right">Stock Akhir</TableHead>
                          <TableHead className="text-right">Stock Aktual</TableHead>
                          {/* <TableHead className="text-right">Selisih</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventoryData?.data?.products?.map((product) => (
                          <TableRow key={product.product_id}>
                            <TableCell>
                              <div className="font-medium">{product.product_name}</div>
                              <div className="text-sm text-muted-foreground">{product.product_code}</div>
                            </TableCell>
                            <TableCell className="text-right">{product.unit}</TableCell>
                            <TableCell className="text-right">{product.saldo_awal}</TableCell>
                            <TableCell className="text-right">{product.stock_masuk}</TableCell>
                            <TableCell className="text-right">{product.stock_keluar}</TableCell>
                            <TableCell className="text-right">{product.stock_akhir}</TableCell>
                            <TableCell className="text-right">{product.stock_aktual}</TableCell>
                            {/* <TableCell className={`text-right ${
                              product.selisih !== 0 ? 'text-red-500 font-bold' : ''
                            }`}>
                              {product.selisih !== 0 ? product.selisih : '-'}
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Produk Dengan Stock Masuk Terbanyak</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produk</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...inventoryData?.data?.products]
                              .sort((a, b) => b.stock_masuk - a.stock_masuk)
                              .slice(0, 5)
                              .map((product) => (
                                <TableRow key={product.product_id}>
                                  <TableCell className="font-medium">{product.product_name}</TableCell>
                                  <TableCell className="text-right">{product.stock_masuk}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Produk Dengan Stock Keluar Terbanyak</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produk</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...inventoryData?.data?.products]
                              .sort((a, b) => b.stock_keluar - a.stock_keluar)
                              .slice(0, 5)
                              .map((product) => (
                                <TableRow key={product.product_id}>
                                  <TableCell>{product.product_name}</TableCell>
                                  <TableCell className="text-right">{product.stock_keluar}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Produk</CardTitle>
              <CardDescription>
                Daftar produk berdasarkan rentang tanggal
                {selectedOutletId !== "all" && currentOutlet && ` untuk ${currentOutlet.name}`}
              </CardDescription>
              <div className="flex justify-between items-center mt-4">
                <DateRangePicker 
                  value={dateRange} 
                  onChange={handleDateRangeChange} 
                />
                <Button onClick={fetchProductsData}>
                  Terapkan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <p>Memuat data...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : productsData?.length === 0 ? (
                <p className="text-center py-8">Tidak ada data yang tersedia</p>
              ) : (
                <>
                  {summaryData && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">Rp {summaryData.total_sales?.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Kuantitas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{summaryData.total_quantity?.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{summaryData.total_orders?.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">Rp {summaryData.average_order_value?.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-right">Jumlah Order</TableHead>
                        <TableHead className="text-right">Total Kuantitas</TableHead>
                        <TableHead className="text-right">Total Penjualan</TableHead>
                        <TableHead className="text-right">Kontribusi (%)</TableHead>
                        {/* <TableHead className="text-right">Aksi</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsData.map((product, index) => (
                        <TableRow key={product.id || index}>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.product_name}</TableCell>
                          <TableCell>{product.category_name || '-'}</TableCell>
                          <TableCell className="text-right">
                            {product.order_count.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.total_quantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            Rp {product.total_sales.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.sales_percentage}%
                          </TableCell>
                          {/* <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleShowDetail(product)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Detail
                            </Button>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kategori" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Penjualan Per Kategori</CardTitle>
              <CardDescription>
                Data penjualan produk dikelompokkan per kategori
              </CardDescription>
              <div className="flex justify-between items-center mt-4">
                <DateRangePicker 
                  value={dateRange} 
                  onChange={handleDateRangeChange} 
                />
                <Button onClick={fetchProductsData}>
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
              ) : !data?.data?.categories ? (
                <div className="text-center py-4">Tidak ada data penjualan</div>
              ) : (
                <>
                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={data.data.categories.map((category) => ({
                          name: category.category_name,
                          penjualan: Number(category.total_sales),
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
                          tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
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

                  <div className="space-y-6">
                    {data.data.categories.map((category) => (
                      <div key={category.category_id} className="border rounded-lg">
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{category.category_name}</h3>
                            <p className="text-sm text-gray-500">
                              {category.products.length} produk terjual
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              Rp {Number(category.total_sales).toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {category.sales_percentage.toFixed(2)}% dari total
                            </p>
                          </div>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produk</TableHead>
                              <TableHead className="text-right">SKU</TableHead>
                              <TableHead className="text-right">Kuantitas</TableHead>
                              <TableHead className="text-right">Penjualan</TableHead>
                              <TableHead className="text-right">% Kategori</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.products.map((product) => (
                              <TableRow key={product.product_id}>
                                <TableCell className="font-medium">
                                  {product.product_name}
                                </TableCell>
                                <TableCell className="text-right">
                                  {product.product_sku}
                                </TableCell>
                                <TableCell className="text-right">
                                  {Number(product.quantity)}
                                </TableCell>
                                <TableCell className="text-right">
                                  Rp {Number(product.sales).toLocaleString('id-ID')}
                                </TableCell>
                                <TableCell className="text-right">
                                  {product.sales_percentage.toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Kategori</p>
                        <p className="font-medium">{data.data.summary.total_categories}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Produk Terjual</p>
                        <p className="font-medium">{data.data.summary.total_products}</p>
                      </div> 
                      <div>
                        <p className="text-sm text-gray-500">Total Kuantitas</p>
                        <p className="font-medium">{data.data.summary.total_quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Penjualan</p>
                        <p className="font-medium">
                          Rp {Number(data.data.summary.total_sales).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>  
      </Tabs>
      {/* <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"> 
          <DialogHeader>
            <DialogTitle>Detail Laporan Bulanan</DialogTitle>
            <DialogDescription>
              {selectedReport && `${selectedReport.month} ${selectedReport.year}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Transaksi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedReport.totalTransactions.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Penjualan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp {selectedReport.totalSales.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="sm:col-span-2 lg:col-span-1"> 
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Rata-rata per Transaksi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp {selectedReport.avgTicket.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> 
               
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Produk Terlaris</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead className="text-right">Pendapatan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedReport.topProducts?.map((product, index) => (
                            <TableRow key={index}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell className="text-right">
                                Rp {product.revenue.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

               
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Kategori Produk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kategori</TableHead>
                            <TableHead className="text-right">Total Penjualan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedReport.categories?.map((category, index) => (
                            <TableRow key={index}>
                              <TableCell>{category.name}</TableCell>
                              <TableCell className="text-right">
                                Rp {category.sales.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
