const express = require('express');

const {
  getAllShipment,
  updateShipment,
} = require('../controllers/shipment.controller');
const authJwt = require('../middleware/authJwt');
const router = express.Router();

router
  .get('/', getAllShipment)
  .get('/update/:id', [authJwt.verifyToken, authJwt.isEmployee], updateShipment)
module.exports = router;
