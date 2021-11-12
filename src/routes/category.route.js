const express = require('express');
const authJwt = require('../middleware/authJwt');
const {
  createCategory,
  getAllCategory,
  getCategoryParent,
} = require('../controllers/category.controller');
const router = express.Router();

router
  .get('/', getAllCategory)
  .get('/parent', getCategoryParent)
  .post('/', [authJwt.verifyToken, authJwt.isEmployee], createCategory);

module.exports = router;
