const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const https = require('https');
const db = require('../models');
const Product = db.product;
const Order = db.order;
const Op = db.Sequelize.Op;
router.post('/checkout', async function (req, response) {
  try {
    const order = req.body;
    const totalPrice = order.listItems.reduce(
      (total, item) => total + Number(item.quantity) * Number(item.price),
      0
    );
    const quantity = order.listItems.reduce(
      (total, item) => total + Number(item.quantity),
      0
    );
    const productOrder = order.listItems.map((item) => {
      const items = [];
      items.push(item.productId);
      return items;
    });

    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretkey = process.env.MOMO_SECRET_KEY;
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = 'Thanh toán với Momo';
    const redirectUrl = 'http://localhost:3000/cart';
    const ipnUrl = 'http://localhost:3000/cart';
    // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    const amount = `${totalPrice}`;
    const requestType = 'captureWallet';
    const extraData = 'name=PhamQuocTuan'; //pass empty value if your merchant does not have stores
    // https://test-payment.momo.vn/gw_payment/transactionProcessor
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    //signature
    const data = {
      name: orderId,
      total: quantity,
      amount: totalPrice,
      price: totalPrice,
      userId: order.userId,
      status: 1,
    };

    const newOrder = await Order.create(data);
    const product = await Product.findAll({
      where: {
        id: {
          [Op.or]: productOrder,
        },
      },
    });
    newOrder.setProducts(product, { quantity: 1 });
    const signature = crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'en',
    });
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const momo = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        body = JSON.parse(chunk).payUrl;
        response.status(200).json(body);
      });
    });
    // write data to request body
    momo.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    momo.write(requestBody);
    momo.end();
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
