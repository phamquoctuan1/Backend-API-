const express = require('express');
const {
  getAllOrder,
  updateOrder,
  getOrderById,
} = require('../controllers/order.controller');
const authJwt = require('../middleware/authJwt');
const router = express.Router();


router
  .get('/', getAllOrder)
  .get('/:id', getOrderById)
  .get('/update/:id', [authJwt.verifyToken, authJwt.isEmployee], updateOrder);
module.exports = router;