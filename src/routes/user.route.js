const express = require('express');
const authJwt = require('../middleware/authJwt');
const {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
  updateUser,
  getOrderUser,
  getOrderDetailUser,
  getUserById,
  getAllUser,
  adminRestoreUser,
} = require('../controllers/user.controller');
const router = express.Router();

router
  .patch('/update', updateUser)
  .get('/all', allAccess)
  .get('/getorder/:id', getOrderUser)
  .get('/:id', getUserById)
  .get('/getorderdetail/:id', getOrderDetailUser)
  .get('/', [authJwt.verifyToken], getAllUser)
  .get('/mod', [authJwt.verifyToken, authJwt.isEmployee], moderatorBoard)
  .get('/admin', [authJwt.verifyToken, authJwt.isAdmin], adminBoard)
  .get(
    '/restore/:id',
    [authJwt.verifyToken, authJwt.isEmployee],
    adminRestoreUser
  );
module.exports = router;
