import { Outlet } from "@/types/outlet";
import { Product } from "@/types/product";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const exportCsvHandler = (products: Product[], outlet: Outlet) => {
    if (!products || !outlet) return;

    const currentDate = format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })
    // Header dengan informasi laporan
    const reportHeader = [
      ['LAPORAN PRODUK BERDASARKAN RENTANG TANGGAL'],
      [`Outlet: ${outlet.name}`],
      [`Tanggal Ekspor: ${currentDate}`],
      [], // Baris kosong untuk spacing
    ];

    // Baris kosong untuk spacing
    const spacing = [''];

    // Data produk
    const productsHeader = ['DATA PRODUK'];
    const productsColumns = [
      'No',
      'SKU',
      'Nama produk',
      'Kategori',
      'Min-Stok',
      'Stok',
      'Harga',
      'Status',
    ];

    const productsRows = products.map((product, index) => [
      index + 1,
      product.sku,
      product.name,
      product.category.name || '-',
      product.min_stock,
      product.quantity,
      product.price,
      product.is_active ? 'Aktif' : 'Non-Aktif',
      // product.sales_percentage
    ]);

    // Format angka dengan separator ribuan
    const formattedProductsRows = productsRows.map(row => [
      row[0], // No
      `"${row[1]}"`, // SKU
      `"${row[2]}"`, // Nama Produk
      `"${row[3]}"`, // Kategori
      `"${row[4]}"`, // Min Stok
      `"${row[5]}"`, // Quantity
      // `"${row[4].toLocaleString('id-ID')}"`, // Jumlah Order
      `"Rp ${row[6].toLocaleString('id-ID')}"`, // Total Penjualan
      `"${row[7]}"`, // Status
    ]);

    // Gabungkan semua bagian
    const csvContent = [
      ...reportHeader,
      // summaryHeader,
      // ...formattedSummaryData,
      // summaryData,
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
    link.setAttribute('download', `Laporan_Produk_${outlet.name || 'All'}_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };