const express = require('express');
const router = express.Router();
const {
  createPayment,
  successPayment,
} = require('../controllers/paypal.controller');
router.get('/pay', createPayment);
router.get('/success', successPayment);

module.exports = router;
