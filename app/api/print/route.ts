import escpos from 'escpos';

// Enable USB support
escpos.USB = require('escpos-usb');

export async function POST(req) {
  try {
    const body = await req.json();
    const { transaction, outlet, templateData } = body;

    const device = new escpos.USB(); // Ambil USB pertama yang tersedia
    const printer = new escpos.Printer(device);

    return new Promise((resolve, reject) => {
      device.open(() => {
        printer
          .align('CT')
          .text(templateData.company_name || '')
          .text(templateData.company_slogan || '')
          .text(outlet.name || '')
          .text(`Alamat: ${outlet.address}`)
          .text(`Telp: ${outlet.phone}`)
          .text('-----------------------------')
          .align('LT')
          .text(`No Invoice: ${transaction.order_number}`)
          .text(`Tanggal: ${transaction.created_at}`)
          .text(`Kasir: ${transaction.user}`)
          .text('-----------------------------');

        transaction.items.forEach(item => {
          printer.text(`${item.quantity}x ${item.product}`);
          printer.text(`Rp ${(item.price * item.quantity).toLocaleString()}`);
          if (item.discount > 0) {
            printer.text(`Diskon: -Rp ${item.discount.toLocaleString()}`);
          }
        });

        printer
          .text('-----------------------------')
          .text(`Subtotal: Rp ${transaction.subtotal.toLocaleString()}`)
          .text(`Diskon: Rp -${transaction.discount.toLocaleString()}`)
          .text(`Total: Rp ${transaction.total.toLocaleString()}`)
          .text(`Metode: ${transaction.payment_method.toUpperCase()}`);

        if (transaction.payment_method === 'cash') {
          printer.text(`Bayar: Rp ${transaction.total_paid.toLocaleString()}`);
          printer.text(`Kembali: Rp ${transaction.change.toLocaleString()}`);
        }

        if (transaction.member) {
          printer.text(`Member: ${transaction.member.name} (${transaction.member.member_code})`);
        }

        printer
          .text('-----------------------------')
          .align('CT')
          .text(templateData.footer_message || '')
          .cut()
          .close();

        resolve(Response.json({ message: 'Struk berhasil dicetak' }));
      });
    });
  } catch (err) {
    console.error('Print Error:', err);
    return new Response(JSON.stringify({ error: 'Gagal mencetak struk' + err }), { status: 500 });
  }
}
