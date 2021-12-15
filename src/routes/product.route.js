const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const {
  createProduct,
  getAllProduct,
  deleteProduct,
  getProductById,
  getAmountProductByCategory,
  updateProduct,
  restoreProduct,
  getProductBySlug,
  AnalyticsProduct,
  AnalyticsPrice,
} = require('.././controllers/product.controller');
router
  .get('/', getAllProduct)
  .get('/:id', getProductById)
  .get('/slug/:slug', getProductBySlug)
  .post('/', [authJwt.verifyToken, authJwt.isEmployee], createProduct)
  .get('/category/:id', getAmountProductByCategory)
  .delete('/:id', [authJwt.verifyToken, authJwt.isEmployee], deleteProduct)
  .patch('/:id', [authJwt.verifyToken, authJwt.isEmployee], updateProduct)
  .get(
    '/restore/:id',
    [authJwt.verifyToken, authJwt.isEmployee],
    restoreProduct
  )
  .get(
    '/analytics/product/top',
    [authJwt.verifyToken, authJwt.isEmployee],
    AnalyticsProduct
  )
  .get(
    '/analytics/amount/top',
    [authJwt.verifyToken, authJwt.isEmployee],
    AnalyticsPrice
  );
module.exports = router;
