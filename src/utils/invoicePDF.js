const fs = require('fs');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
let fontpath = __dirname + '/../fonts/times.ttf';
let imgpath = __dirname + '/Logo-2.png';
let path = __dirname + '/hoadondientu.pdf';
const { numberWithCommas } = require('./common');


function generateHeader(doc) {
  doc
    .image(imgpath, 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Shop-HT', 110, 45, { align: 'right' })
    .fontSize(10)
    .font(fontpath)
    .text('142 Cao lỗ', 200, 65, { align: 'right' })
    .text('Phường 4, Quận 8, TPHCM', 200, 80, { align: 'right' })
    .moveDown();
}
function generateFooter(doc) {
     
  doc
    .font(fontpath)
    .fontSize(10)
    .text('Cảm ơn bạn đã ủng hộ Shop-HT.', 50, 680, {
      align: 'center',
      width: 500,
    });
}
function generateCustomerInformation(doc, invoice) {
  doc
    .font(fontpath)
    .text(`Mã hóa đơn: ${invoice.name}`, 50, 200)
    .font(fontpath)
    .text(`Ngày tạo : ${dayjs(invoice.createdAt).format('DD/MM/YYYY')}`, 50, 215)
    .moveDown()
    .text(`Tên khách hàng :${invoice.shipmentInfo.name_customer}`, 300, 200)
    .text(`Địa chỉ : ${invoice.shipmentInfo.address}`, 300, 215)
    .moveDown();
}
function generateTableRow(doc, y,c0, c1, c2, c3, c4, c5) {
  doc
    .fontSize(10)
    .text(c0, 50, y)
    .text(c1, 180, y)
    .text(c2, 240, y)
    .text(c3, 280, y, { width: 90, align: 'right' })
    .text(c4, 370, y, { width: 90, align: 'right' })
    .text(c5, 0, y, { align: 'right' });
}

function generateInvoiceTable(doc, invoice) {
  let i,
    invoiceTableTop = 330;
     doc.font(fontpath);
    generateTableRow(
      doc,
      invoiceTableTop,
      'Tên sản phẩm',
      'Màu sắc',
      'Kích cỡ',
      'Giá',
      'Số lượng',
      'Tổng cộng'
    );
     generateHr(doc, invoiceTableTop + 20);
     doc.font(fontpath);
  for (i = 0; i < invoice.OrderDetails.length; i++) {
    const item = invoice.OrderDetails[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.productName,
      item.color,
      item.size,
      numberWithCommas(item.price),
      item.quantity,
      numberWithCommas(item.price * item.quantity)
    );
    
    generateHr(doc, position + 20);
  }
  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Tổng tiền',
    '',
    numberWithCommas(invoice.amount)
  );

}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

 function  createInvoice(invoice) {

  let doc = new PDFDocument({ margin: 50});
  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}



module.exports = createInvoice;