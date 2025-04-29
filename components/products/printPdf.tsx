import { Outlet } from '@/types/outlet';
import { Product } from '@/types/product'
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React from 'react'

export default function printPdfHandler(products: Product[], outlet: Outlet) {

  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-1000px';
  printFrame.style.left = '-1000px';
  document.body.appendChild(printFrame);

  // Format dates using date-fns with Indonesian locale
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
  // const startDate = format(dateRangeMember.from, 'dd MMM yyyy', { locale: id });
  // const endDate = format(dateRangeMember.to, 'dd MMM yyyy', { locale: id });

  const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Produk</title>
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
            <div class="title">LAPORAN PRODUK</div>
            <div class="subtitle">Outlet: ${outlet.name}</div>
            <div class="date">Dicetak pada: ${currentDate}</div>
          </div>
        </div>
  
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-label">Total Produk:</span>
            <span>${products.length}</span>
          </div>
        </div>
  
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>SKU</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th class="text-right">Stok</th>
              <th class="text-right">Min-Stok</th>
              <th class="text-right">Harga</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((product, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category.name}</td>
                <td class="text-right">${product.min_stock}</td>
                <td class="text-right">${product.quantity}</td>
                <td class="text-right">Rp ${product.price}</td>
                <td>${product.is_active ? 'Aktif' : 'Non-Aktif'}</td>
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

      return printFrame.onload = function () {
        setTimeout(() => {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }, 5);
      };
  // return (
  //   <div>
      
  //   </div>
  // )
}
