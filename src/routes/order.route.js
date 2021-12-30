const express = require('express');
const {
  getAllOrder,
  updateOrder,
  getOrderById,
  deleteOrder,
  getDeletedOrder,
  restoreOrder,
} = require('../controllers/order.controller');
const authJwt = require('../middleware/authJwt');
const router = express.Router();


router
  .get('/', getAllOrder)
  .get('/trash',[authJwt.verifyToken, authJwt.isEmployee], getDeletedOrder)
  .get('/restore/:id',[authJwt.verifyToken, authJwt.isEmployee], restoreOrder)
  .get('/:id', getOrderById)
  .get('/update/:id', [authJwt.verifyToken, authJwt.isEmployee], updateOrder)
  .delete(
    '/delete/:id',
    [authJwt.verifyToken, authJwt.isEmployee],
    deleteOrder
  )
  .delete(
    '/deletebyUser/:id',
    deleteOrder
  );
module.exports = router;