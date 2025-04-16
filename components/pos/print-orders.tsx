import { HistoryOrder, OrderItem } from "@/types/order-history";
import { Outlet } from "@/types/outlet";

interface PrintOrdersProps {
  transactions: HistoryOrder,
  outlet: Outlet
}

export const printOrders = ({ transactions, outlet }: PrintOrdersProps) => {

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const formatRupiah = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };

  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-1000px';
  printFrame.style.left = '-1000px';
  document.body.appendChild(printFrame);

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Kifa Bakery</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
          color: #333;
        }
        .header { 
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 10px; 
        }
        .subtitle { 
          font-size: 14px; 
          margin-bottom: 5px; 
          color: #666;
        }
        .date {
          font-size: 12px;
          color: #666;
        }
        .order-card {
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #ddd;
        }
        .order-header {
          margin-bottom: 10px;
        }
        .order-header span {
          display: inline-block;
          min-width: 150px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
        }
        th { 
          background-color: #f5f5f5; 
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
          text-align: right;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Laporan Penjualan Kifa Bakery</div>
        <div class="subtitle">Outlet: ${outlet.name}</div>
        <div class="subtitle">Alamat: ${outlet.address}</div>
        <div class="subtitle">Telp: ${outlet.phone}</div>
        <div class="date">Dicetak pada: ${currentDate}</div>
        <div class="subtitle">Periode: ${transactions.date_from} - ${transactions.date_to}</div>
      </div>

      ${transactions.orders.map(order => `
        <div class="order-card">
          <div class="order-header">
            <div><span>No. Invoice:</span> ${order.order_number}</div>
            <div><span>Tanggal:</span> ${order.created_at}</div>
            <div><span>Kasir:</span> ${order.user}</div>
            <div><span>Pajak:</span> Rp ${formatRupiah(order.tax)}</div>
            <div><span>Total:</span> Rp ${formatRupiah(order.total)}</div>
            <div><span>Status:</span> ${order.status=== "completed" ? "Selesai" : order.status === "cancelled" ? "Dibatalkan" : "Pending"}</div>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kuantitas</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.product}</td>
                    <td>${item.quantity}</td>
                    <td>Rp ${formatRupiah(item.price)}</td>
                    <td>Rp ${formatRupiah(item.total)}</td>
                  </tr>
                  `).join('')}
                  <tr>
                    <td style="border-bottom: 0"></td>
                    <td style="border-bottom: 0"></td>
                    <td style="border-bottom: 0">Subtotal: </td>
                    <td style="border-bottom: 0">Rp ${formatRupiah(order.subtotal)}</td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}

      <div class="footer">
        Total Orders: ${transactions.total_orders} <br/>
        Total Revenue: Rp ${formatRupiah(transactions.total_revenue)} <br/>
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
