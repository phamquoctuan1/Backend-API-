const express = require('express');
const { getAll, Analytics, AnalyticsPrice } = require('../controllers/test.controller');
const { getAllUser } = require('../controllers/user.controller');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const db = require('../models');
const Product = db.product;
const Order = db.order;
const Op = db.Sequelize.Op;
const OrderProduct = db.order_product;
const Image = db.image;
const User = db.user;
const Shipment= db.shipment

router.get('/order/:id', getAll);
router.get('/product/top', AnalyticsPrice);
module.exports = router;
