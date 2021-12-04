const dateFormat = require('dateformat');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const https = require('https');
const db = require('../models');
const { sortObject } = require('../utils/common');
const Product = db.product;
const Order = db.order;
const OrderProduct = db.order_product;
const Op = db.Sequelize.Op;
const queryString = require('qs');
const {
  checkoutNormal,
  checkoutMomo,
  callbackMomo,
  checkoutVNPAY,
  returnVNPay,
} = require('../controllers/payment.controller');
const requestIp = require('request-ip');

router.post('/checkout/normal', checkoutNormal);
//MOMO
router.post('/checkout/momo', checkoutMomo);

router.get('/momo/callback', callbackMomo);
// router.post('/momo/ipn', callbackMomo);

// Zalo

router.post('/checkout/zalopay');
//VNPAY

router.post('/checkout/vnpay',checkoutVNPAY);

// router.get('/checkout/vnpay_ipn', function (req, res, next) {
//   var vnp_Params = req.query;
//   var secureHash = vnp_Params['vnp_SecureHash'];

//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];

//   vnp_Params = sortObject(vnp_Params);
//   var config = require('config');
//   const secretKey = process.env.vnp_HashSecret;
//   var querystring = require('qs');
//   var signData = querystring.stringify(vnp_Params, { encode: false });
//   var crypto = require('crypto');
//   var hmac = crypto.createHmac('sha512', secretKey);
//   var signed = hmac.update(signData).digest('hex');

//   if (secureHash === signed) {
//     var orderId = vnp_Params['vnp_TxnRef'];
//     var rspCode = vnp_Params['vnp_ResponseCode'];
//     //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
//     res.status(200).json({ RspCode: '00', Message: 'success' });
//   } else {
//     res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
//   }
// });

router.get('/return/vnpay', returnVNPay);
module.exports = router;
