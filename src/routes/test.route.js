const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const db = require('../models');
const { deleteAllFile } = require('../utils/upload');
const Product = db.product;
const Order = db.order;
const Op = db.Sequelize.Op;
const OrderProduct = db.order_product;
const Image = db.image;
const User = db.user;

module.exports = router;
