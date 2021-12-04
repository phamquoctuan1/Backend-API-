const crypto = require('crypto');
const https = require('https');
const db = require('../models');
const { sortObject } = require('../utils/common');
const Product = db.product;
const Order = db.order;
const OrderProduct = db.order_product;
const Op = db.Sequelize.Op;
const queryString = require('qs');
const dateFormat = require('dateformat');
const Shipment = db.shipment;
exports.checkoutNormal = async (req, response) => {
  const t = await db.sequelize.transaction();
  try {
    const order = req.body;
    const totalPrice = order.listItems.reduce(
      (total, item) => total + Number(item.quantity) * Number(item.price),
      0
    );
    const data = {
      name: 'NORMALW6KW200005' + new Date().getTime(),
      amount: totalPrice + order.fee,
      orderType: 'Nomarl',
      userId: order.userId,
      status: 0,
    };
    const orderStore = await Order.create(data, { transaction: t });
    const productOrder = order.listItems.map((item) => (
      {
      name: item.name,
      productId: item.productId,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      price: item.price,
    })); 
   
    for (let index = 0; index < productOrder.length; index++) {
      const name = productOrder[index].name;
      const productId = productOrder[index].productId;
      const quantity = productOrder[index].quantity;
      const color = productOrder[index].color;
       
      const size = productOrder[index].size;
      const price = productOrder[index].price;
      const orderDetails = await OrderProduct.create(
        {
          productName: name,
          orderId: orderStore.id,
          productId,
          quantity,
          color,
          size,
          price,
        },
        { transaction: t }
      );       
        const product = await Product.findByPk(productId, {
          transaction: t,
        });
        product.quantity = product.quantity - quantity
         product.save();
    }
    
    shipment_data = {
      name_customer: order.name_customer,
      phone: order.phone,
      ship_method: 'ghtk',
      ship_cost: order.fee,
      status: 0,
      ship_date: new Date().toISOString(),
      estimated_time: '5 days',
      address: order.address,
      orderId: orderStore.id,
    };
    const shipment_info = await Shipment.create(shipment_data, {
      transaction: t,
    });
    await t.commit();
    response
      .status(200)
      .json({
        message: 'Đặt hàng thành công kiểm tra đơn hàng tại Hồ sơ của bạn',
      });
  } catch (error) {
    await t.rollback();
    response
      .status(400)
      .json({
        message: 'Hệ thống đang lỗi quý khách vui lòng đặt hàng lại sau',
        error: error.message,
      });
  }
};

exports.checkoutMomo = async (req, response) => {
  const t = await db.sequelize.transaction();
  try {
    const order = req.body;
    const totalPrice = order.listItems.reduce(
      (total, item) => total + Number(item.quantity) * Number(item.price),
      0
    );
    const data = {
      name: process.env.MOMO_PARTNER_CODE + new Date().getTime(),
      amount: totalPrice + order.fee,
      orderType: 'Momo',
      userId: order.userId,
      status: 0,
    };
    const orderStore = await Order.create(data, { transaction: t });
    const productOrder = order.listItems.map((item) => ({
      name: item.name,
      productId: item.productId,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      price: item.price,
    }));
    if (orderStore)
      shipment_data = {
        phone: order.phone,
        name_customer: order.name_customer,
        ship_method: 'ghtk',
        ship_cost: order.fee,
        status: 0,
        ship_date: new Date().toISOString(),
        estimated_time: '5 days',
        address: order.address,
        orderId: orderStore.id,
      };
   const shipment_info = await Shipment.create(shipment_data, {
     transaction: t,
   });
    for (let index = 0; index < productOrder.length; index++) {
      const name = productOrder[index].name;
      const productId = productOrder[index].productId;
      const quantity = productOrder[index].quantity;
      const color = productOrder[index].color;
      const size = productOrder[index].size;
      const price = productOrder[index].price;
    
      const orderDetails = await OrderProduct.create(
        {
          productName: name,
          orderId: orderStore.id,
          productId,
          quantity,
          color,
          size,
          price,
        },
        { transaction: t }
      );
       const product = await Product.findByPk(productId, {
         transaction: t,
       });
       product.quantity = product.quantity - quantity;
       product.save();
    }
       
    await t.commit();

  
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretkey = process.env.MOMO_SECRET_KEY;
    const requestId = partnerCode + new Date().getTime();
    const orderId = orderStore.id;
    const orderInfo = 'thanh toan voi momo';
    const redirectUrl = 'http://localhost:5000/api/payment/momo/callback';
    const ipnUrl = 'http://localhost:5000/api/payment/momo/ipn';
    // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    const amount = `${totalPrice + order.fee}`;
    const requestType = 'captureWallet';
    // const extraData = `${order.userId},${productOrder}`; //pass empty value if your merchant does not have stores
    const extraData = '';
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
      lang: 'vi',
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
    await t.rollback();
    console.log(error);
  }
};



exports.callbackMomo = async (req, res) => {
  const dataOrder = req.query;
  const query = queryString.stringify({
    resultCode: dataOrder.resultCode,
    message: dataOrder.message,
  });
  const updateOrder = await Order.findByPk(Number(dataOrder.orderId));
  if (Number(dataOrder.resultCode) === 0) {
    updateOrder.status = 1;
    updateOrder.save();
    return res.redirect(`http://localhost:3000/checkout?${query}`);
  } else {
    return res.redirect(`http://localhost:3000/checkout?${query}`);
  }
};

// IPN
// exports.callbackMomo = async (req, res) => {
//   const dataOrder = req.query;
//   console.log(dataOrder);
//   const updateOrder = await Order.findByPk(Number(dataOrder.orderId));
//   if (Number(dataOrder.resultCode) === 0) {
//     updateOrder.status = 1;
//     updateOrder.save();
//     console.log('1');
//     return res.status(200).json({ message: 'Thành công' });
//   } else {
//     console.log('2');
//     return res.status(400).json({ message: 'Thất bại ' });
//   }
// };

//VNPAY

exports.checkoutVNPAY = async (req, res) => {
   const t = await db.sequelize.transaction();
   try {
     const order = req.body;
     const totalPrice = order.listItems.reduce(
       (total, item) => total + Number(item.quantity) * Number(item.price),
       0
     );
     const data = {
       name: 'VNPAYW6KW199907' + new Date().getTime(),
       amount: totalPrice + order.fee,
       orderType: 'VNPay',
       userId: order.userId,
       status: 0,
     };
     const orderStore = await Order.create(data, { transaction: t });
     const productOrder = order.listItems.map((item) => ({
       name: item.name,
       productId: item.productId,
       quantity: item.quantity,
       color: item.color,
       size: item.size,
       price: item.price,
     }));

     for (let index = 0; index < productOrder.length; index++) {
       const name = productOrder[index].name;
       const productId = productOrder[index].productId;
       const quantity = productOrder[index].quantity;
       const color = productOrder[index].color;
       const size = productOrder[index].size;
       const price = productOrder[index].price;
       const orderDetails = await OrderProduct.create(
         {
           productName: name,
           orderId: orderStore.id,
           productId,
           quantity,
           color,
           size,
           price,
         },
         { transaction: t }
       );
        const product = await Product.findByPk(productId, {
          transaction: t,
        });
        product.quantity = product.quantity - quantity;
        product.save();
     }
        shipment_data = {
          phone: order.phone,
          name_customer: order.name_customer,
          ship_method: 'ghtk',
          ship_cost: order.fee,
          status: 0,
          ship_date: new Date().toISOString(),
          estimated_time: '5 days',
          address: order.address,
        };
        const shipment_info = await Shipment.create(shipment_data, {
          transaction: t,
        });
    
     const ipAddr = '127.0.0.1';
     const tmnCode = process.env.vnp_TmnCode;

     const secretKey = process.env.vnp_HashSecret;
     let vnpUrl = process.env.vnp_Url;
     const returnUrl = process.env.vnp_ReturnUrl;
     const date = new Date();
     const createDate = dateFormat(date, 'yyyymmddHHmmss');
     const orderId = orderStore.id;
     const amount = totalPrice + order.fee;
     const orderType = '200000';

     const orderInfo = 'Thanh toan hoa don';
     const locale = 'vn';

     const currCode = 'VND';
     let vnp_Params = {};
     vnp_Params['vnp_Version'] = '2.1.0';
     vnp_Params['vnp_Command'] = 'pay';
     vnp_Params['vnp_TmnCode'] = tmnCode;
     // vnp_Params['vnp_Merchant'] = ''
     vnp_Params['vnp_OrderType'] = orderType;
     vnp_Params['vnp_Locale'] = locale;
     vnp_Params['vnp_CurrCode'] = currCode;
     vnp_Params['vnp_TxnRef'] = orderId;
     vnp_Params['vnp_OrderInfo'] = orderInfo;
     vnp_Params['vnp_Amount'] = amount * 100;
     vnp_Params['vnp_ReturnUrl'] = returnUrl;
     vnp_Params['vnp_IpAddr'] = ipAddr;
     vnp_Params['vnp_CreateDate'] = createDate;
     vnp_Params['vnp_BankCode'] = 'NCB';
     vnp_Params = sortObject(vnp_Params);

     const querystring = require('qs');
     const signData = querystring.stringify(vnp_Params, { encode: false });
     const crypto = require('crypto');
     const hmac = crypto.createHmac('sha512', secretKey);
     const signed = hmac.update(signData).digest('hex');
     vnp_Params['vnp_SecureHash'] = signed;
     vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    await t.commit();
     res.status(200).json(vnpUrl);
   } catch (error) {
     await t.rollback();
     res.status(400).json({
       message: 'Đặt hàng thất bại kiểm tra lại thông tin',
       error: error.message,
     });
   }
   };


exports.returnVNPay = async  (req, res) => {
  let vnp_Params = req.query;
  const query = queryString.stringify({
    vnp_ResponseCode: vnp_Params.vnp_ResponseCode,
    message: vnp_Params.vnp_TransactionStatus,
  });
  const updateOrder = await Order.findByPk(Number(vnp_Params.vnp_TxnRef));
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.vnp_HashSecret;
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(signData).digest('hex');

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
 if (vnp_Params.vnp_ResponseCode === '00') {
   updateOrder.status = 1;
   updateOrder.save();
   return res.redirect(`http://localhost:3000/checkout/?${query}`);
 } else {
   return res.redirect(`http://localhost:3000/checkout/?${query}`);
 }
}
     
};