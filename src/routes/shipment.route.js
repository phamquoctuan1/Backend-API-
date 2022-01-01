const express = require('express');

const {
  getAllShipment,
  updateShipment,
  cancelShipment,
} = require('../controllers/shipment.controller');
const authJwt = require('../middleware/authJwt');
const router = express.Router();

router
  .get('/', getAllShipment)
  .get('/update/:id', [authJwt.verifyToken, authJwt.isEmployee], updateShipment)
  .get(
    '/cancel/:id',
    [authJwt.verifyToken, authJwt.isEmployee],
    cancelShipment
  );
  
module.exports = router;
