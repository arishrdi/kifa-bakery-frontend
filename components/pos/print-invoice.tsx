import { OrderItem } from "@/types/order-history";

interface PrintInvoice {
  cashierName: string;
  order: OrderItem;
}

export const PrintInvoice = ({ order, cashierName }: PrintInvoice) => {
  const invoiceContent = `
    <div style="font-family: 'Arial', sans-serif; padding: 10px; max-width: 80mm; margin: auto; background: #fff;">
      <div style="text-align: center; margin-bottom: 10px;">
        <h1 style="font-size: 18px; font-weight: bold; color: #e67e22;">Kifa Bakery</h1>
        <p style="font-size: 12px; color: #555;">Rajanya Roti Hajatan</p>
        <p style="font-size: 10px; color: #777;">Jl. Raya Bakery No. 123, Jakarta</p>
      </div>

      <hr style="border: 1px dashed #ccc; margin: 5px 0;">

      <h2 style="text-align: center; font-size: 16px; font-weight: bold; color: #333;">INVOICE</h2>
      <p style="font-size: 10px; color: #555;">Tanggal: ${new Date(order.created_at).toLocaleString()}</p>

      <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-top: 5px;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd;">
            <th align="left">Produk</th>
            <th align="center">Qty</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.product}</td>
              <td align="center">${item.quantity}</td>
              <td align="right">Rp ${parseInt(item.total).toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <hr style="border: 1px dashed #ccc; margin: 8px 0;">

      <div style="font-size: 10px; text-align: right;">
        <p>Subtotal: Rp ${parseInt(order.subtotal).toLocaleString()}</p>
        <p>PPN: Rp ${parseInt(order.tax).toLocaleString()}</p>
        <p>Diskon: Rp ${parseInt(order.discount).toLocaleString()}</p>
        <p style="font-weight: bold;">Total: Rp ${parseInt(order.total).toLocaleString()}</p>

        ${
          order.payment_method === "cash"
            ? `
          <p>Uang Diterima: Rp ${parseInt(order.total_paid).toLocaleString()}</p>
          <p>Kembalian: Rp ${parseInt(order.change).toLocaleString()}</p>
        `
            : ""
        }
      </div>

      <hr style="border: 1px dashed #ccc; margin: 8px 0;">

      <div style="font-size: 10px;">
        <p>Outlet: ${order.outlet}</p>
        <p>Kasir: ${cashierName}</p>
        <p>Nomor Faktur: ${order.order_number}</p>
        <p>Metode Pembayaran: ${order.payment_method}</p>
      </div>

      <p style="text-align: center; font-size: 10px; color: #777; margin-top: 10px;">
        Terima kasih atas pembelian Anda!
      </p>
    </div>
  `;

  const printWindow = window.open("", "_blank");

  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice Sweet Bakery</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                font-family: 'Arial', sans-serif;
                font-size: 10px;
                width: 80mm;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
