const express = require('express');
const authJwt = require('../middleware/authJwt');
const {
  createCategory,
  getAllCategory,
} = require('../controllers/category.controller');
const router = express.Router();

router
  .get('/', getAllCategory)
  .post('/', [authJwt.verifyToken, authJwt.isEmployee], createCategory);

module.exports = router;
