import { usePrintTemplateByOutlet } from "@/services/print-template-service"
import { OrderItem } from "@/types/order-history"
import { Outlet } from "@/types/outlet"
import { PrintTemplate } from "@/types/template-print"

export const handlePrintReceipt = (transaction: OrderItem, outlet: Outlet, templateData: PrintTemplate) => {


  const printWindow = window.open('', '_blank', 'width=400,height=600')

  if (printWindow) {
    const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Struk Transaksi #${transaction.order_number}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 20px;
              max-width: 300px;
            }
           .header {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .header-text {
              flex: 1;
              text-align: right;
            }
            
            .logo-container {
              display: flex;
              align-items: center;
            }
            
            .logo {
              max-width: 50px;
              height: auto;
            }
            
            .title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .info {
              font-size: 12px;
              margin: 5px 0;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 5px 0;
            }
            .total {
              font-weight: bold;
              margin-top: 10px;
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
            }
            .logo {
              max-width: 40px; 
              height: auto; 
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img src="${templateData?.logo_url}" 
                  alt="Logo Outlet" 
                  class="logo"/>
            </div>
            <div class="header-text">
              <div class="title">${templateData?.company_name}</div>
              <div class="info">${templateData?.company_slogan}</div>
              <div class="info">${outlet.name}</div>
              <div class="info">Alamat: ${outlet.address}</div>
              <div class="info">Telp: ${outlet.phone}</div>
            </div>
          </div>

            <div class="divider"></div>
            <div class="info">No. Invoice: ${transaction.order_number}</div>
            <div class="info">Tanggal: ${transaction.created_at}</div>
            <div class="info">Kasir: ${transaction.user}</div>
          </div>
          <div class="divider"></div>
          <div>
            ${transaction.items.map(item => `
              <div class="item">
                <div>${item.quantity}x ${item.product}</div>
                <div>
                  Rp ${Number(Number(item.price) * item.quantity).toLocaleString()}
                  ${Number(item.discount) > 0 ? ` (-${Number(item.discount).toLocaleString()})` : ''}
                </div>
              </div>
              `).join('')}
              <div class="divider"></div>
              ${parseInt(transaction.tax) > 0
        ? `
                <div class="item">
                  <div>PPN:</div>
                  <div>Rp ${Number(transaction.tax).toLocaleString()}</div>
                </div>
                `
        : ''
      }
          <div class="item">
            <div>Subtotal: </div>
            <div>Rp ${Number(transaction.subtotal).toLocaleString()}</div>
          </div>
          <div class="item">
            <div>Total Diskon:</div>
            <div>Rp -${Number(transaction.discount).toLocaleString()}</div>
          </div>
          </div>
          <div class="divider"></div>
          <div class="total">Total: Rp ${Number(transaction.total).toLocaleString()}</div>
          <div class="item">
            <div>Metode Pembayaran:</div>
            <div>${transaction.payment_method === "cash" ? "TUNAI" : transaction.payment_method === "qris" ? "QRIS" : "TRANSFER" }</div>
          </div>
           ${transaction.payment_method === 'cash'
        ? `
          <div class="item">
            <div>Bayar:</div>
            <div>Rp ${Number(transaction.total_paid).toLocaleString()}</div>
          </div>
          <div class="item">
            <div>Kembalian:</div>
            <div>Rp ${Number(transaction.change).toLocaleString()}</div>
          </div>
        `
        : ''
      }
          <div class="divider"></div>
           ${transaction.member ? `
            <div class="info">
                Member: ${transaction.member.name} (${transaction.member.member_code})
            </div>
        ` : ''}
          <div class="footer">
            ${templateData?.footer_message}
          </div>
        </body>
        </html>
      `

    // Write content to the new window
    printWindow.document.open()
    printWindow.document.write(receiptContent)
    printWindow.document.close()

    // Trigger print when content is loaded
    printWindow.onload = function () {
      printWindow.print()
      // Close the window after printing (optional - some browsers might close automatically)
      // printWindow.close()
    }
  } else {
    console.error('Failed to open print window')
    alert('Tidak dapat membuka jendela cetak. Periksa pengaturan popup browser Anda.')
  }
}