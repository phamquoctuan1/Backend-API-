const express = require('express');
const authJwt = require('../middleware/authJwt');
const {
  createCategory,
  getAllCategory,
  getCategoryParent,
  getCategoryById,
  deleteCategory,
  updateCategory,
} = require('../controllers/category.controller');
const router = express.Router();

router
  .get('/', getCategoryParent)
  .get('/parent', getAllCategory)
  .get('/:id', getCategoryById)
  .delete('/:id', [authJwt.verifyToken, authJwt.isEmployee], deleteCategory)
  .patch('/:id', [authJwt.verifyToken, authJwt.isEmployee], updateCategory)
  .post('/', [authJwt.verifyToken, authJwt.isEmployee], createCategory);

module.exports = router;
