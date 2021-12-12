const { numberWithCommas } = require("./common");

 const payOrderEmailTemplate = (order) => {
  return `<h1>Cảm ơn đã đặt hàng tại Shop_HT</h1>
  <p>
  Chào ${order.shipmentInfo.name_customer},</p>
  <p>Chúng tôi nhận được đơn hàng của bạn.</p>
  <h2>[Order ${order.name}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Sản phẩm</strong></td>
  <td><strong>Số lượng</strong></td>
  <td><strong align="right">Giá</strong></td>
  </thead>
  <tbody>
  ${order.OrderDetails.map(
    (item) => `
    <tr>
    <td>${item.productName}</td>
    <td align="center">${item.quantity}</td>
    <td align="right"> ${numberWithCommas(item.price)}</td>
    </tr>
  `
  ).join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Phí ship:</td>
  <td align="right"> ${numberWithCommas(order.shipmentInfo.ship_cost)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Tổng tiền:</strong></td>
  <td align="right"><strong> ${numberWithCommas(order.amount)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Phương thức thanh toán:</td>
  <td align="right">${order.orderType}</td>
  </tr>
  </table>
  <h2>Địa chỉ giao hàng</h2>
  <p>
  ${order.shipmentInfo.name_customer},<br/>
  ${order.shipmentInfo.address},<br/>
  ${order.shipmentInfo.phone},<br/>
  </p>
  <hr/>
  <p>
  Cảm ơn đã ủng hộ chúng tôi, Chúc bạn một ngày vui vẻ!.
  </p>
  `;
};

module.exports = payOrderEmailTemplate;